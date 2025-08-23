import { supabase } from "@/integrations/supabase/client";
import type { QuizAnswer, CareerPath, AIAnalysis } from "@/types/quiz";

export const analyzeQuizWithAI = async (
  answers: QuizAnswer[],
  careerPaths: CareerPath[]
): Promise<AIAnalysis | null> => {
  try {
    console.log('🚀 Starting AI analysis...');
    console.log('📥 Input validation:', {
      answersCount: answers.length,
      careerPathsCount: careerPaths.length,
      hasTextResponses: answers.some(a => typeof a.value === 'string' && a.value.length > 20),
      sampleQuestionIds: answers.slice(0, 5).map(a => a.questionId)
    });
    
    console.log('📡 Calling Supabase edge function: analyze-quiz-results');
    const startTime = Date.now();
    
    const { data, error } = await supabase.functions.invoke('analyze-quiz-results', {
      body: { answers, careerPaths }
    });

    const duration = Date.now() - startTime;
    console.log(`⏱️ Edge function call completed in ${duration}ms`);

    if (error) {
      console.error('❌ Supabase function error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`AI Analysis failed: ${error.message || 'Unknown Supabase error'}`);
    }

    if (!data) {
      console.error('❌ Edge function returned no data');
      throw new Error('AI Analysis returned empty response');
    }

    // Validate the returned data structure
    console.log('🔍 Validating AI analysis response structure...');
    const isValid = data && 
      typeof data === 'object' && 
      (data.specificOccupations || data.hiddenBeliefs || data.enhancedPersonality);
    
    if (!isValid) {
      console.error('❌ Invalid AI analysis response structure:', data);
      throw new Error('AI Analysis returned invalid data structure');
    }

    console.log('✅ AI analysis completed successfully');
    console.log('📊 Full response data:', JSON.stringify(data, null, 2));
    console.log('📊 Response summary:', {
      hasSpecificOccupations: !!(data.specificOccupations?.length),
      occupationsCount: data.specificOccupations?.length || 0,
      hasHiddenBeliefs: !!data.hiddenBeliefs,
      hasEnhancedPersonality: !!data.enhancedPersonality,
      successBlockersCount: data.hiddenBeliefs?.successBlockers?.length || 0,
      moneyBeliefsCount: data.hiddenBeliefs?.moneyBeliefs?.length || 0,
      version: data._version || 'unknown',
      timestamp: data._timestamp || 'unknown'
    });
    
    return data as AIAnalysis;
  } catch (error) {
    console.error('💥 AI Analysis service failed:', {
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      timestamp: new Date().toISOString()
    });
    throw error; // Re-throw for proper error handling upstream
  }
};