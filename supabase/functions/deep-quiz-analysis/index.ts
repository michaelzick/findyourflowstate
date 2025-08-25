import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { answers, careerPaths } = await req.json()

    console.log('🚀 Starting deep quiz analysis with enhanced sections...')
    console.log('📥 Input:', { answersCount: answers.length, careerPathsCount: careerPaths.length })

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Prepare the comprehensive prompt for all analysis sections
    const prompt = `You are an expert career counselor and psychologist. Analyze the following quiz responses and provide comprehensive insights in the exact JSON format specified.

QUIZ RESPONSES:
${JSON.stringify(answers, null, 2)}

TOP CAREER PATHS:
${JSON.stringify(careerPaths, null, 2)}

Please provide a comprehensive analysis in this EXACT JSON structure:

{
  "specificOccupations": [
    {
      "title": "Specific job title",
      "category": "Industry category",
      "fitScore": 85,
      "reasoning": "Detailed explanation of why this role fits based on their responses"
    }
  ],
  "hiddenBeliefs": {
    "successBlockers": ["Belief or pattern that limits success"],
    "moneyBeliefs": ["Underlying belief about money and wealth"],
    "fearPatterns": ["Core fear that drives behavior"],
    "coreInsights": ["Deep psychological insight about their patterns"]
  },
  "enhancedPersonality": {
    "cognitiveStyle": "Detailed description of how they process information and think",
    "motivationalDrivers": ["What truly motivates them at a deep level"],
    "relationshipStyle": "How they approach relationships and connection",
    "workEnvironmentNeeds": "Specific environmental needs for optimal performance"
  },
  "deepAnalysis": {
    "behavioralPatterns": ["Recurring patterns in their behavior and decision-making"],
    "unconsciousDrivers": ["Hidden motivations that influence their actions"],
    "blindSpots": ["Areas where their self-awareness may be limited"],
    "selfSabotagePatterns": ["Ways they might undermine their own success"],
    "emotionalTriggers": ["Situations or stimuli that provoke strong reactions"],
    "decisionMakingStyle": "Comprehensive analysis of how they approach choices and problem-solving",
    "stressResponse": "How they naturally respond to stress and pressure",
    "conflictStyle": "Their approach to handling disagreements and conflicts",
    "leadershipStyle": "Their natural leadership approach and influence style",
    "communicationStyle": "How they naturally express themselves and connect with others"
  },
  "lifePurpose": {
    "coreContribution": "Their fundamental gift or contribution to the world",
    "meaningfulImpact": ["Areas where they can make the most significant difference"],
    "naturalGifts": ["Their innate talents and abilities"],
    "worldNeeds": ["What the world needs that aligns with their unique combination of skills"],
    "purposeAlignment": "Analysis of how well their current path matches their deeper calling",
    "fulfillmentFactors": ["What brings them the deepest satisfaction and meaning"],
    "legacyVision": "How they want to be remembered and what lasting impact they want to make",
    "serviceOrientation": "Their natural way of contributing to and serving others",
    "spiritualDimension": "Their connection to meaning, purpose, and transcendence beyond material success"
  }
}

ANALYSIS GUIDELINES:
1. Base all insights on their actual quiz responses, especially the detailed text answers
2. Look for patterns across multiple responses to identify deeper themes
3. Pay special attention to their flow activities, energy drains, failures, and life vision
4. Identify unconscious patterns they may not be aware of
5. Focus on actionable insights that can guide their career and life decisions
6. Be specific and personal rather than generic
7. Include 3-5 specific occupations that match their unique profile
8. Identify 3-5 items for each array field
9. Make the life purpose analysis deeply meaningful and inspiring
10. Ensure the deep analysis reveals genuine blind spots and growth areas

Provide only the JSON response with no additional text or formatting.`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert career counselor and psychologist who provides deep, personalized insights based on comprehensive quiz responses. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ OpenAI response received')

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid OpenAI response structure')
    }

    const aiContent = data.choices[0].message.content.trim()
    console.log('🔍 AI Content:', aiContent.substring(0, 200) + '...')

    // Parse the JSON response
    let analysisResult
    try {
      analysisResult = JSON.parse(aiContent)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Raw content:', aiContent)
      throw new Error('Failed to parse AI response as JSON')
    }

    // Validate the response structure
    const requiredSections = ['specificOccupations', 'hiddenBeliefs', 'enhancedPersonality', 'deepAnalysis', 'lifePurpose']
    const missingSections = requiredSections.filter(section => !analysisResult[section])

    if (missingSections.length > 0) {
      console.warn('Missing sections:', missingSections)
      // Add empty structures for missing sections to prevent UI errors
      missingSections.forEach(section => {
        if (section === 'specificOccupations') {
          analysisResult[section] = []
        } else {
          analysisResult[section] = {}
        }
      })
    }

    // Add metadata
    analysisResult._version = '2.0'
    analysisResult._timestamp = new Date().toISOString()
    analysisResult._model = 'gpt-4o'

    console.log('✅ Deep quiz analysis completed successfully')
    console.log('📊 Response summary:', {
      hasSpecificOccupations: !!(analysisResult.specificOccupations?.length),
      occupationsCount: analysisResult.specificOccupations?.length || 0,
      hasHiddenBeliefs: !!analysisResult.hiddenBeliefs,
      hasEnhancedPersonality: !!analysisResult.enhancedPersonality,
      hasDeepAnalysis: !!analysisResult.deepAnalysis,
      hasLifePurpose: !!analysisResult.lifePurpose,
      successBlockersCount: analysisResult.hiddenBeliefs?.successBlockers?.length || 0,
      behavioralPatternsCount: analysisResult.deepAnalysis?.behavioralPatterns?.length || 0,
      naturalGiftsCount: analysisResult.lifePurpose?.naturalGifts?.length || 0
    })

    return new Response(
      JSON.stringify(analysisResult),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('💥 Deep quiz analysis edge function error:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})