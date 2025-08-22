import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
            content: `You are an expert career and psychological analyst combining insights from Brené Brown, Tony Robbins, and Brianna Wiest. Analyze quiz responses to reveal:

1. Specific occupation recommendations (3-5 per career path)
2. Hidden beliefs and psychological blockers
3. Money mindset patterns
4. Success fears and sabotage patterns
5. Relationship and working style insights

Return ONLY valid JSON with this exact structure:
{
  "specificOccupations": [
    {
      "title": "Music Producer",
      "category": "Creative Arts", 
      "fitScore": 92,
      "reasoning": "Strong creative expression and technical interests align perfectly"
    }
  ],
  "hiddenBeliefs": {
    "successBlockers": ["perfectionism", "imposter syndrome"],
    "moneyBeliefs": ["scarcity mindset", "worthiness issues"],
    "fearPatterns": ["fear of visibility", "success sabotage"],
    "coreInsights": ["Deep analysis of psychological patterns..."]
  },
  "enhancedPersonality": {
    "cognitiveStyle": "Visual-spatial processor with strong pattern recognition",
    "motivationalDrivers": ["autonomy", "mastery", "purpose"],
    "relationshipStyle": "Collaborative but values independence",
    "workEnvironmentNeeds": "Creative freedom with structure"
  }
}`
          },
          {
            role: 'user',
            content: `Analyze these quiz responses for deep psychological insights:

Career Paths: ${JSON.stringify(careerPaths)}

Quiz Answers: ${JSON.stringify(answers)}

Focus on text responses about money beliefs, success definition, childhood patterns, and work preferences. Identify unconscious patterns, limiting beliefs, and specific career matches.`
          }
        ],
        max_tokens: 2000
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ OpenAI API error:', data);
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    console.log('✅ GPT-4o response received');
    
    let analysis;
    try {
      const content = data.choices[0].message.content;
      console.log('📝 Raw GPT response:', content);
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('❌ Failed to parse GPT response as JSON:', parseError);
      console.error('Raw content:', data.choices[0]?.message?.content);
      // Fallback analysis structure
      analysis = {
        specificOccupations: [],
        hiddenBeliefs: {
          successBlockers: [],
          moneyBeliefs: [],
          fearPatterns: [],
          coreInsights: []
        },
        enhancedPersonality: {
          cognitiveStyle: "Unable to analyze - please try again",
          motivationalDrivers: [],
          relationshipStyle: "Analysis unavailable",
          workEnvironmentNeeds: "Analysis unavailable"
        }
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-quiz-results function:', error);
    return new Response(JSON.stringify({ 
      error: 'Analysis failed', 
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});