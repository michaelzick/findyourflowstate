import { supabase } from "@/integrations/supabase/client";
import type { QuizAnswer, CareerPath, AIAnalysis } from "@/types/quiz";

export const analyzeQuizWithAI = async (
  answers: QuizAnswer[],
  careerPaths: CareerPath[]
): Promise<AIAnalysis | null> => {
  try {
    console.log('Starting AI analysis of quiz results');
    
    const { data, error } = await supabase.functions.invoke('analyze-quiz-results', {
      body: { answers, careerPaths }
    });

    if (error) {
      console.error('Error calling analyze-quiz-results function:', error);
      return null;
    }

    console.log('AI analysis completed successfully');
    return data as AIAnalysis;
  } catch (error) {
    console.error('Failed to analyze quiz with AI:', error);
    return null;
  }
};