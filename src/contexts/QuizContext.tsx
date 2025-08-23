import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizAnswer, QuizResults } from '@/types/quiz';
import { calculateQuizResults } from '@/utils/quiz-scoring';

interface QuizState {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  results: QuizResults | null;
  isComplete: boolean;
  isAiAnalysisLoading: boolean;
  aiAnalysisError: string | null;
}

type QuizAction =
  | { type: 'ANSWER_QUESTION'; payload: QuizAnswer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'SET_RESULTS'; payload: QuizResults }
  | { type: 'SET_AI_ANALYSIS_LOADING'; payload: boolean }
  | { type: 'UPDATE_AI_ANALYSIS'; payload: QuizResults }
  | { type: 'SET_AI_ANALYSIS_ERROR'; payload: string }
  | { type: 'RESET_QUIZ' }
  | { type: 'GOTO_QUESTION'; payload: number };

const initialState: QuizState = {
  currentQuestionIndex: -1,
  answers: [],
  results: null,
  isComplete: false,
  isAiAnalysisLoading: false,
  aiAnalysisError: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
      case 'ANSWER_QUESTION': {
        const existingAnswerIndex = state.answers.findIndex(
          a => a.questionId === action.payload.questionId
        );

        let newAnswers;
        if (existingAnswerIndex >= 0) {
          newAnswers = [...state.answers];
          newAnswers[existingAnswerIndex] = action.payload;
        } else {
          newAnswers = [...state.answers, action.payload];
        }

        return {
          ...state,
          answers: newAnswers,
        };
      }

      case 'NEXT_QUESTION':
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex + 1,
        };

      case 'PREVIOUS_QUESTION':
        return {
          ...state,
          currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        };

      case 'COMPLETE_QUIZ':
        return {
          ...state,
          isComplete: true,
          isAiAnalysisLoading: true,
          aiAnalysisError: null,
        };

    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
        isAiAnalysisLoading: !action.payload.aiAnalysis,
        aiAnalysisError: null,
      };

    case 'SET_AI_ANALYSIS_LOADING':
      return {
        ...state,
        isAiAnalysisLoading: action.payload,
      };

    case 'UPDATE_AI_ANALYSIS':
      return {
        ...state,
        results: action.payload,
        isAiAnalysisLoading: false,
        aiAnalysisError: null,
      };

    case 'SET_AI_ANALYSIS_ERROR':
      return {
        ...state,
        isAiAnalysisLoading: false,
        aiAnalysisError: action.payload,
      };

    case 'RESET_QUIZ':
      return initialState;

      case 'GOTO_QUESTION':
        return {
          ...state,
          currentQuestionIndex: action.payload,
        };

      default:
        return state;
    }
  }

interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  answerQuestion: (answer: QuizAnswer) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  goToQuestion: (index: number) => void;
  getAnswerForQuestion: (questionId: string) => QuizAnswer | undefined;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const answerQuestion = (answer: QuizAnswer) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: answer });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const previousQuestion = () => {
    dispatch({ type: 'PREVIOUS_QUESTION' });
  };

  const completeQuiz = async () => {
    dispatch({ type: 'COMPLETE_QUIZ' });

    // Calculate basic results first (without AI)
    try {
      const basicResults = await calculateQuizResults(state.answers, false);
      dispatch({ type: 'SET_RESULTS', payload: basicResults });

      // Then enhance with AI analysis
      try {
        console.log('🤖 Starting AI enhancement phase...');
        const enhancedResults = await calculateQuizResults(state.answers, true);
        console.log('🎯 AI enhancement completed:', {
          hasAiAnalysis: !!enhancedResults.aiAnalysis,
          specificOccupationsCount: enhancedResults.aiAnalysis?.specificOccupations?.length || 0,
          hasHiddenBeliefs: !!enhancedResults.aiAnalysis?.hiddenBeliefs,
          hasEnhancedPersonality: !!enhancedResults.aiAnalysis?.enhancedPersonality
        });
        dispatch({ type: 'UPDATE_AI_ANALYSIS', payload: enhancedResults });
      } catch (aiError) {
        console.error('💥 AI analysis failed:', aiError);
        const errorMessage = aiError instanceof Error ? aiError.message : 'AI analysis failed';
        dispatch({ type: 'SET_AI_ANALYSIS_ERROR', payload: errorMessage });
      }
    } catch (error) {
      console.error('Error calculating quiz results:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate quiz results';
      dispatch({ type: 'SET_AI_ANALYSIS_ERROR', payload: errorMessage });
    }
  };

  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  const goToQuestion = (index: number) => {
    dispatch({ type: 'GOTO_QUESTION', payload: index });
  };

  const getAnswerForQuestion = (questionId: string) => {
    return state.answers.find(a => a.questionId === questionId);
  };

  return (
    <QuizContext.Provider
      value={{
        state,
        dispatch,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        completeQuiz,
        resetQuiz,
        goToQuestion,
        getAnswerForQuestion,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
