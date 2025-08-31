import { supabase } from '@/integrations/supabase/client';
import { QuizAnswer, CareerPath } from '@/types/quiz';

// Service-specific logger that respects production environment
const createLogger = (prefix: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    log: (...args: unknown[]) => !isProduction && console.log(`[${prefix}]`, ...args),
    error: (...args: unknown[]) => !isProduction && console.error(`[${prefix}]`, ...args),
    warn: (...args: unknown[]) => !isProduction && console.warn(`[${prefix}]`, ...args),
  };
};

const logger = createLogger('CareerRanking');

interface CareerRanking {
  id: string;
  score: number;
  reasoning: string;
}

interface RankingResponse {
  rankedCareerPaths: CareerRanking[];
}

export async function rankCareerPathsWithAI(
  answers: QuizAnswer[], 
  careerPaths: CareerPath[]
): Promise<CareerPath[]> {
  logger.log('🎯 Starting AI-powered career path ranking');
  logger.log('📊 Input:', { answersCount: answers.length, careerPathsCount: careerPaths.length });

  try {
    const { data, error } = await supabase.functions.invoke('rank-career-paths', {
      body: {
        answers,
        careerPaths
      }
    });

    if (error) {
      logger.error('❌ Supabase function error:', error);
      throw error;
    }

    if (!data || !data.rankedCareerPaths) {
      logger.error('❌ Invalid response structure:', data);
      throw new Error('Invalid response from ranking service');
    }

    logger.log('✅ AI ranking successful');
    logger.log('📈 Rankings received:', data.rankedCareerPaths.length);

    // Map the AI rankings back to full CareerPath objects
    const rankedPaths = data.rankedCareerPaths.map((ranking: CareerRanking) => {
      const originalPath = careerPaths.find(cp => cp.id === ranking.id);
      if (!originalPath) {
        throw new Error(`Career path not found: ${ranking.id}`);
      }
      
      return {
        ...originalPath,
        score: Math.round(ranking.score),
        aiReasoning: ranking.reasoning
      };
    });

    // Sort by score and return top 3
    return rankedPaths
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

  } catch (error) {
    logger.error('❌ Career ranking failed:', error);
    throw error;
  }
}