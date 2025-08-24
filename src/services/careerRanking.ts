import { supabase } from '@/integrations/supabase/client';
import { QuizAnswer, CareerPath } from '@/types/quiz';

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
  console.log('🎯 Starting AI-powered career path ranking');
  console.log('📊 Input:', { answersCount: answers.length, careerPathsCount: careerPaths.length });

  try {
    const { data, error } = await supabase.functions.invoke('rank-career-paths', {
      body: {
        answers,
        careerPaths
      }
    });

    if (error) {
      console.error('❌ Supabase function error:', error);
      throw error;
    }

    if (!data || !data.rankedCareerPaths) {
      console.error('❌ Invalid response structure:', data);
      throw new Error('Invalid response from ranking service');
    }

    console.log('✅ AI ranking successful');
    console.log('📈 Rankings received:', data.rankedCareerPaths.length);

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
    console.error('❌ Career ranking failed:', error);
    throw error;
  }
}