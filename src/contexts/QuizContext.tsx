import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { QuizAnswer, QuizResults } from '@/types/quiz';
import { calculateQuizResults } from '@/utils/quiz-scoring';
import { quizQuestions } from '@/data/quiz-questions';

interface QuizState {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  results: QuizResults | null;
  isComplete: boolean;
  isAiAnalysisLoading: boolean;
  aiAnalysisError: string | null;
  hasUploadedAnswers: boolean;
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
  | { type: 'GOTO_QUESTION'; payload: number }
  | { type: 'LOAD_ANSWERS_FROM_JSON'; payload: QuizAnswer[] }
  | { type: 'LOAD_FROM_LOCALSTORAGE'; payload: { answers: QuizAnswer[]; currentQuestionIndex: number } };

// localStorage utilities
const QUIZ_STORAGE_KEY = 'career-quiz-progress';

const saveToLocalStorage = (answers: QuizAnswer[], currentQuestionIndex: number) => {
  try {
    const data = {
      answers,
      currentQuestionIndex,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save quiz progress to localStorage:', error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        answers: data.answers || [],
        currentQuestionIndex: data.currentQuestionIndex || -1
      };
    }
  } catch (error) {
    console.warn('Failed to load quiz progress from localStorage:', error);
  }
  return null;
};

const clearLocalStorage = () => {
  try {
    localStorage.removeItem(QUIZ_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear quiz progress from localStorage:', error);
  }
};

const initialState: QuizState = {
  currentQuestionIndex: -1,
  answers: [],
  results: null,
  isComplete: false,
  isAiAnalysisLoading: false,
  aiAnalysisError: null,
  hasUploadedAnswers: false,
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

      case 'LOAD_ANSWERS_FROM_JSON':
        return {
          ...state,
          answers: action.payload,
          currentQuestionIndex: 0, // Start at first question to review answers
          hasUploadedAnswers: true,
        };

      case 'LOAD_FROM_LOCALSTORAGE':
        return {
          ...state,
          answers: action.payload.answers,
          currentQuestionIndex: action.payload.currentQuestionIndex,
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
  resetQuizAndClearStorage: () => void;
  goToQuestion: (index: number) => void;
  getAnswerForQuestion: (questionId: string) => QuizAnswer | undefined;
  loadAnswersFromJSON: (answers: QuizAnswer[]) => void;
  canSubmitQuiz: () => boolean;
  getIncompleteQuestions: () => string[];
  downloadAnswersAsJSON: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromLocalStorage();
    if (stored && stored.answers.length > 0) {
      dispatch({ type: 'LOAD_FROM_LOCALSTORAGE', payload: stored });
    }
  }, []);

  // Save to localStorage whenever answers or currentQuestionIndex changes
  useEffect(() => {
    if (state.answers.length > 0 && !state.isComplete) {
      saveToLocalStorage(state.answers, state.currentQuestionIndex);
    }
  }, [state.answers, state.currentQuestionIndex, state.isComplete]);

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

  const loadAnswersFromJSON = (answers: QuizAnswer[]) => {
    dispatch({ type: 'LOAD_ANSWERS_FROM_JSON', payload: answers });
  };

  const canSubmitQuiz = () => {
    const requiredQuestions = quizQuestions.filter((q) => q.required !== false);
    return requiredQuestions.every((q) =>
      state.answers.some(a => a.questionId === q.id && a.value !== '' && a.value !== null && a.value !== undefined)
    );
  };

  const getIncompleteQuestions = () => {
    const requiredQuestions = quizQuestions.filter((q) => q.required !== false);
    return requiredQuestions
      .filter((q) => !state.answers.some(a =>
        a.questionId === q.id && a.value !== '' && a.value !== null && a.value !== undefined
      ))
      .map((q) => q.question);
  };

  const downloadAnswersAsJSON = () => {
    const answersData = {
      timestamp: new Date().toISOString(),
      totalQuestions: state.answers.length,
      answers: state.answers
    };

    const blob = new Blob([JSON.stringify(answersData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz-answers-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        loadAnswersFromJSON,
        canSubmitQuiz,
        getIncompleteQuestions,
        downloadAnswersAsJSON,
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
