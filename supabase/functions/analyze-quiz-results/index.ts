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
    
    console.log('🚀 Analyzing quiz results with GPT-5');
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
        model: 'gpt-5-2025-08-07',
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

Return ONLY valid JSON with this exact structure:
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

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ OpenAI API error:', data);
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    console.log('✅ GPT-5 response received');
    
    let analysis;
    try {
      const content = data.choices[0].message.content;
      console.log('📝 Raw GPT response:', content);
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('❌ Failed to parse GPT response as JSON:', parseError);
      console.error('Raw content:', data.choices[0]?.message?.content);
      // Fallback analysis structure with more helpful content
      analysis = {
        specificOccupations: [
          {
            title: "Analysis in progress...",
            category: "AI Enhancement", 
            fitScore: 85,
            reasoning: "Complete your quiz to unlock personalized career recommendations based on advanced psychological analysis."
          }
        ],
        hiddenBeliefs: {
          successBlockers: ["AI analysis temporarily unavailable"],
          moneyBeliefs: ["Enhanced insights being generated..."],
          fearPatterns: ["Detailed analysis in progress"],
          coreInsights: ["Your comprehensive personality analysis includes traditional assessment results above. AI-enhanced psychological insights may take a moment to process."]
        },
        enhancedPersonality: {
          cognitiveStyle: "Enhanced cognitive analysis is being processed. Your core personality insights are available in the detailed results above.",
          motivationalDrivers: ["AI analysis in progress", "Traditional analysis complete"],
          relationshipStyle: "Detailed relationship insights are being generated through advanced AI analysis.",
          workEnvironmentNeeds: "Enhanced environment recommendations are being processed. Check your detailed career path analysis above for comprehensive insights."
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