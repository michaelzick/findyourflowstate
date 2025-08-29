import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

console.log('🔑 OpenAI API Key status:', openAIApiKey ? 'Present' : 'Missing');
console.log('🔑 API Key length:', openAIApiKey?.length || 0);

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

    console.log('🚀 Analyzing quiz results with GPT-4o');
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
            model: 'gpt-4o', // Using GPT-4o
            messages: [
              {
                role: 'system',
                content: `You are an expert career and psychological analyst combining insights from Brené Brown, Tony Robbins, and Brianna Wiest.

Analyze quiz responses to provide deep psychological insights into career alignment. Focus on:

1. SPECIFIC OCCUPATIONS: Identify 4-6 highly specific job titles (not just categories) that match the person's psychological profile
2. HIDDEN BELIEFS: Uncover unconscious patterns about success, money, and achievement
3. PSYCHOLOGICAL BLOCKERS: Identify self-sabotage patterns, fears, and limiting beliefs
4. ENHANCED PERSONALITY: Provide nuanced cognitive and motivational insights

For each specific occupation, provide:
- Exact job title (e.g. "UX Research Manager", "Clinical Psychologist", "Data Visualization Specialist")
- Fit score between 75-95% (be realistic, not all high scores)
- Detailed reasoning connecting their psychological patterns to the role

For hidden beliefs, analyze text responses about money, success, and childhood to identify:
- Specific success blockers (perfectionism, imposter syndrome, fear of criticism, etc.)
- Money mindset patterns (scarcity, worthiness issues, financial anxiety, etc.)
- Fear patterns (visibility, failure, success, abandonment, etc.)
- Core insights (2-3 deep psychological observations)

CRITICAL: Return ONLY valid JSON with this exact structure. Do not include any explanatory text before or after the JSON:
{
  "specificOccupations": [
    {
      "title": "UX Research Manager",
      "category": "Technology & Design",
      "fitScore": 87,
      "reasoning": "Your analytical mindset combined with empathy for user needs and preference for structured research environments makes this role ideal. Your text responses show pattern recognition abilities and desire to solve human-centered problems."
    }
  ],
  "hiddenBeliefs": {
    "successBlockers": ["perfectionism that prevents starting projects", "need for external validation before taking action"],
    "moneyBeliefs": ["money equals security but also corruption of values", "deserving wealth only through struggle"],
    "fearPatterns": ["fear of being seen as inadequate", "fear that success will change relationships"],
    "coreInsights": ["You have a deep need for autonomy but fear the responsibility that comes with it", "Your childhood pattern of being the 'helper' creates internal conflict about prioritizing your own needs"]
  },
  "enhancedPersonality": {
    "cognitiveStyle": "Systems thinker who processes information through both analytical and intuitive channels, preferring to understand the 'why' before the 'how'",
    "motivationalDrivers": ["meaningful impact on others", "intellectual stimulation", "creative problem-solving", "work-life integration"],
    "relationshipStyle": "Forms deep connections with few people rather than surface-level relationships with many; values loyalty and authenticity over networking",
    "workEnvironmentNeeds": "Collaborative but not overstimulating environments with flexibility for deep focus periods and clear communication of expectations"
  }
}`
              },
              {
                role: 'user',
                content: `Analyze these quiz responses for deep psychological insights and career alignment:

TOP CAREER PATHS IDENTIFIED: ${JSON.stringify(careerPaths)}

DETAILED QUIZ RESPONSES: ${JSON.stringify(answers)}

Pay special attention to:
- Text responses about money beliefs, success definition, childhood patterns
- Scale responses showing work preferences and personality traits
- Multiple choice patterns revealing values and motivations

Provide specific, actionable insights that go beyond surface-level analysis. Focus on unconscious patterns and psychological drivers that influence career choices.`
              }
            ],
            max_completion_tokens: 2000
          }),
        });

        console.log('🌐 OpenAI Response status:', response.status);
        console.log('🌐 OpenAI Response headers:', Object.fromEntries(response.headers.entries()));

        data = await response.json();
        console.log('🌐 Full OpenAI response structure:', JSON.stringify(data, null, 2));

        if (!response.ok) {
          const errorMsg = `OpenAI API error (${response.status}): ${data.error?.message || 'Unknown error'}`;
          console.error('❌', errorMsg);
          console.error('❌ Full error response:', JSON.stringify(data, null, 2));
          lastError = new Error(errorMsg);

          // Don't retry on certain errors
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
        break; // Success, exit retry loop

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
      throw lastError || new Error('AI analysis failed after all retries');
    }

    let analysis;
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
        const sanitized = trimmed
          // Remove any control characters except valid JSON whitespace
          // eslint-disable-next-line no-control-regex
          .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
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

      analysis = JSON.parse(cleanContent);

      // Validate the structure
      if (!analysis.specificOccupations || !analysis.hiddenBeliefs || !analysis.enhancedPersonality) {
        throw new Error('Response missing required fields');
      }

      // Validate that we have actual content, not placeholder text
      const hasPlaceholderText =
        analysis.specificOccupations.some((occ: unknown) =>
          occ.title?.includes('progress') || occ.title?.includes('Analysis') || occ.reasoning?.includes('Complete your quiz')
        ) ||
        analysis.hiddenBeliefs.successBlockers?.some((blocker: string) =>
          blocker.includes('unavailable') || blocker.includes('generated') || blocker.includes('progress')
        );

      if (hasPlaceholderText) {
        throw new Error('AI returned placeholder content instead of analysis');
      }

    } catch (parseError) {
      console.error('❌ Failed to parse or validate GPT response:', parseError);
      console.error('Raw content:', data.choices[0]?.message?.content);

      // Instead of returning placeholder data, throw an error
      throw new Error(`AI analysis failed: ${parseError.message}. Please try again.`);
    }

    // Add a version identifier to confirm the new function is running
    const responseWithVersion = {
      ...analysis,
      _version: 'v2.0-fixed',
      _timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(responseWithVersion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-quiz function:', error);
    console.error('Error stack:', error.stack);

    return new Response(JSON.stringify({
      error: 'Analysis failed',
      message: error.message,
      _version: 'v2.0-fixed-error',
      _timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
