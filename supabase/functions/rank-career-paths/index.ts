import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

console.log('🔑 OpenAI API Key status:', openAIApiKey ? 'Present' : 'Missing');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, careerPaths } = await req.json();

    console.log('🎯 Ranking career paths with GPT-4o');
    console.log('📊 Input data:', { answersCount: answers.length, careerPathsCount: careerPaths.length });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Retry logic for API calls
    const maxRetries = 2;
    let lastError;
    let data;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries}`);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: `You are an expert career psychologist specializing in psychological assessment and career-personality alignment. 

Your task is to analyze quiz responses and rank the provided career paths by psychological fit, providing accurate scores (0-100) for each career path based on deep personality analysis.

**CRITICAL ANALYSIS REQUIREMENTS:**
1. Consider introversion vs extroversion patterns in answers
2. Analyze analytical vs creative thinking preferences  
3. Look for hands-on vs theoretical work preferences
4. Examine people-oriented vs task-oriented tendencies
5. Consider structured vs flexible work environment needs
6. Evaluate independence vs collaboration preferences

**SCORING GUIDELINES:**
- 85-100: Exceptional fit (clear personality alignment)
- 70-84: Strong fit (good alignment with some considerations) 
- 55-69: Moderate fit (mixed alignment, some challenges)
- 40-54: Weak fit (significant misalignment)
- Below 40: Poor fit (major psychological mismatch)

**OUTPUT FORMAT:** Return ONLY valid JSON with this exact structure:
{
  "rankedCareerPaths": [
    {
      "id": "career_id_from_input",
      "score": 87,
      "reasoning": "Detailed psychological reasoning explaining why this career fits this personality profile, referencing specific quiz responses"
    }
  ]
}

**IMPORTANT:** 
- Include ALL career paths from input, ranked by psychological fit
- Provide realistic scores - not every career should score 90+
- Reference specific quiz responses in your reasoning
- Focus on psychological patterns, not surface keywords`
              },
              {
                role: 'user',
                content: `Analyze these quiz responses and rank the career paths by psychological fit:

**CAREER PATHS TO RANK:**
${JSON.stringify(careerPaths, null, 2)}

**DETAILED QUIZ RESPONSES:**
${JSON.stringify(answers, null, 2)}

**ANALYSIS FOCUS:**
Pay special attention to:
- Personality energy source (introversion/extroversion patterns)
- Information processing style (facts vs patterns, analytical vs intuitive)
- Work environment preferences (independent vs collaborative)
- Childhood play patterns and natural inclinations
- Stress response and decision-making styles
- Values and legacy desires

Provide accurate psychological assessment with realistic scoring that reflects true career-personality fit.`
              }
            ],
            max_completion_tokens: 2000
          }),
        });

        console.log('🌐 OpenAI Response status:', response.status);

        data = await response.json();
        console.log('🌐 Full OpenAI response received');

        if (!response.ok) {
          const errorMsg = `OpenAI API error (${response.status}): ${data.error?.message || 'Unknown error'}`;
          console.error('❌', errorMsg);
          lastError = new Error(errorMsg);

          if (response.status === 401 || response.status === 403) {
            throw lastError;
          }

          if (attempt < maxRetries) {
            console.log(`⏳ Waiting before retry...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          throw lastError;
        }

        console.log('✅ GPT response received successfully');
        break;

      } catch (error) {
        console.error(`❌ Attempt ${attempt} failed:`, error.message);
        lastError = error;

        if (attempt < maxRetries) {
          console.log(`⏳ Waiting before retry...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    if (!data) {
      throw lastError || new Error('Career ranking failed after all retries');
    }

    let rankings;
    try {
      const content = data.choices[0].message.content;
      console.log('📝 Raw GPT response:', content);

      // Helper function to extract and sanitize JSON from markdown code blocks or plain JSON
      const extractJSON = (text: string): string => {
        let trimmed = text.trim();
        
        // Check if it's wrapped in markdown code blocks
        if (trimmed.startsWith('```json') && trimmed.endsWith('```')) {
          // Extract content between ```json and ```
          const jsonStart = trimmed.indexOf('\n') + 1;
          const jsonEnd = trimmed.lastIndexOf('\n```');
          trimmed = trimmed.substring(jsonStart, jsonEnd).trim();
        } else if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
          // Check if it's wrapped in generic code blocks
          const firstNewline = trimmed.indexOf('\n');
          if (firstNewline > 0) {
            const jsonStart = firstNewline + 1;
            const jsonEnd = trimmed.lastIndexOf('\n```');
            trimmed = trimmed.substring(jsonStart, jsonEnd).trim();
          }
        }
        
        // Sanitize the JSON string to remove/escape problematic characters
        let sanitized = trimmed
          // Remove any control characters except valid JSON whitespace
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
          // Fix common escape sequence issues
          .replace(/\\n/g, '\\n')
          .replace(/\\r/g, '\\r')
          .replace(/\\t/g, '\\t')
          // Remove any trailing commas before closing braces/brackets
          .replace(/,(\s*[}\]])/g, '$1');
        
        return sanitized;
      };

      const cleanContent = extractJSON(content);
      console.log('🧹 Cleaned content:', cleanContent);
      
      if (!cleanContent.startsWith('{') || !cleanContent.endsWith('}')) {
        throw new Error('Response is not valid JSON format');
      }

      rankings = JSON.parse(cleanContent);

      if (!rankings.rankedCareerPaths || !Array.isArray(rankings.rankedCareerPaths)) {
        throw new Error('Response missing required rankedCareerPaths array');
      }

      // Validate each career path has required fields
      for (const career of rankings.rankedCareerPaths) {
        if (!career.id || typeof career.score !== 'number' || !career.reasoning) {
          throw new Error('Invalid career path structure in response');
        }
      }

    } catch (parseError) {
      console.error('❌ Failed to parse or validate GPT response:', parseError);
      console.error('Raw content:', data.choices[0]?.message?.content);
      throw new Error(`AI ranking failed: ${parseError.message}. Please try again.`);
    }

    const responseWithVersion = {
      ...rankings,
      _version: 'v1.0-career-ranking',
      _timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(responseWithVersion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in rank-career-paths function:', error);
    console.error('Error stack:', error.stack);

    return new Response(JSON.stringify({
      error: 'Career ranking failed',
      message: error.message,
      _version: 'v1.0-career-ranking-error',
      _timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});