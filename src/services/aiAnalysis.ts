import { supabase } from "@/integrations/supabase/client";
import type { QuizAnswer, CareerPath, AIAnalysis } from "@/types/quiz";

export const analyzeQuizWithAI = async (
  answers: QuizAnswer[],
  careerPaths: CareerPath[]
): Promise<AIAnalysis | null> => {
  try {
    console.log('🚀 Starting AI analysis with', answers.length, 'answers and', careerPaths.length, 'career paths');
    
    const { data, error } = await supabase.functions.invoke('analyze-quiz-results', {
      body: { answers, careerPaths }
    });

    if (error) {
      console.error('❌ Supabase function error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw new Error(`AI Analysis failed: ${error.message || 'Unknown error'}`);
    }

    if (!data) {
      console.error('❌ No data returned from AI analysis');
      throw new Error('AI Analysis returned no data');
    }

    console.log('✅ AI analysis completed successfully:', data);
    return data as AIAnalysis;
  } catch (error) {
    console.error('💥 Failed to analyze quiz with AI:', error);
    throw error; // Re-throw instead of returning null so we can handle it properly
  }
};