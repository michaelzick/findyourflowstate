import { supabase } from "@/integrations/supabase/client";
import type { QuizAnswer, CareerPath, AIAnalysis } from "@/types/quiz";

// Service-specific logger that respects production environment
const createLogger = (prefix: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    log: (...args: unknown[]) => !isProduction && console.log(`[${prefix}]`, ...args),
    error: (...args: unknown[]) => !isProduction && console.error(`[${prefix}]`, ...args),
    warn: (...args: unknown[]) => !isProduction && console.warn(`[${prefix}]`, ...args),
  };
};

const logger = createLogger('AIAnalysis');

export const analyzeQuizWithAI = async (
  answers: QuizAnswer[],
  careerPaths: CareerPath[]
): Promise<AIAnalysis | null> => {
  try {
    logger.log('🚀 Starting AI analysis...');
    logger.log('📥 Input validation:', {
      answersCount: answers.length,
      careerPathsCount: careerPaths.length,
      hasTextResponses: answers.some(a => typeof a.value === 'string' && a.value.length > 20),
      sampleQuestionIds: answers.slice(0, 5).map(a => a.questionId)
    });

    logger.log('📡 Calling Supabase edge function: deep-quiz-analysis');
    const startTime = Date.now();

    const { data, error } = await supabase.functions.invoke('deep-quiz-analysis', {
      body: { answers, careerPaths }
    });

    const duration = Date.now() - startTime;
    logger.log(`⏱️ Edge function call completed in ${duration}ms`);

    if (error) {
      logger.error('❌ Supabase function error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`AI Analysis failed: ${error.message || 'Unknown Supabase error'}`);
    }

    if (!data) {
      logger.error('❌ Edge function returned no data');
      throw new Error('AI Analysis returned empty response');
    }

    // Validate the returned data structure
    logger.log('🔍 Validating AI analysis response structure...');
    const isValid = data &&
      typeof data === 'object' &&
      (data.specificOccupations || data.hiddenBeliefs || data.enhancedPersonality);

    if (!isValid) {
      logger.error('❌ Invalid AI analysis response structure:', data);
      throw new Error('AI Analysis returned invalid data structure');
    }

    logger.log('✅ AI analysis completed successfully');
    logger.log('📊 Full response data:', JSON.stringify(data, null, 2));
    logger.log('📊 Response summary:', {
      hasSpecificOccupations: !!(data.specificOccupations?.length),
      occupationsCount: data.specificOccupations?.length || 0,
      hasHiddenBeliefs: !!data.hiddenBeliefs,
      hasEnhancedPersonality: !!data.enhancedPersonality,
      hasDeepAnalysis: !!data.deepAnalysis,
      hasLifePurpose: !!data.lifePurpose,
      successBlockersCount: data.hiddenBeliefs?.successBlockers?.length || 0,
      moneyBeliefsCount: data.hiddenBeliefs?.moneyBeliefs?.length || 0,
      behavioralPatternsCount: data.deepAnalysis?.behavioralPatterns?.length || 0,
      naturalGiftsCount: data.lifePurpose?.naturalGifts?.length || 0,
      version: data._version || 'unknown',
      timestamp: data._timestamp || 'unknown'
    });

    return data as AIAnalysis;
  } catch (error) {
    logger.error('💥 AI Analysis service failed:', {
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      timestamp: new Date().toISOString()
    });
    throw error; // Re-throw for proper error handling upstream
  }
};


