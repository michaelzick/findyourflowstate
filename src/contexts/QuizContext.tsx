import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizAnswer, QuizResults } from '@/types/quiz';
import { calculateQuizResults } from '@/utils/quiz-scoring';
import { quizQuestions } from '@/data/quiz-questions';
import {
  clearQuizResults,
  saveQuizResults,
  loadQuizResults,
  hasStoredQuizResults,
  safeSaveQuizResults,
  safeLoadQuizResults,
  QuizResultsStorageError
} from '@/utils/quiz-results-storage';
import { markQuizCompletionNavigation, clearNavigationState } from '@/utils/navigation-state';

interface QuizState {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  results: QuizResults | null;
  isComplete: boolean;
  isAiAnalysisLoading: boolean;
  aiAnalysisError: string | null;
  hasUploadedAnswers: boolean;
  savedResults: QuizResults | null;
  isResultsRoute: boolean;
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
  | { type: 'LOAD_FROM_LOCALSTORAGE'; payload: { answers: QuizAnswer[]; currentQuestionIndex: number } }
  | { type: 'SAVE_RESULTS_TO_STORAGE'; payload: QuizResults }
  | { type: 'LOAD_RESULTS_FROM_STORAGE'; payload: QuizResults | null }
  | { type: 'CLEAR_ACTIVE_RESULTS' }
  | { type: 'SET_RESULTS_ROUTE'; payload: boolean };

// localStorage utilities
const QUIZ_STORAGE_KEY = 'career-quiz-progress';

const saveToLocalStorage = (answers: QuizAnswer[], currentQuestionIndex: number) => {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage is not available');
      return;
    }

    const data = {
      answers,
      currentQuestionIndex,
      timestamp: new Date().toISOString(),
      version: '1.0.0' // Add version for future compatibility
    };

    const serializedData = JSON.stringify(data);
    localStorage.setItem(QUIZ_STORAGE_KEY, serializedData);
  } catch (error) {
    console.warn('Failed to save quiz progress to localStorage:', error);

    // Handle quota exceeded error
    if (error instanceof Error && (error.name === 'QuotaExceededError' || error.message.includes('quota'))) {
      console.warn('localStorage quota exceeded, attempting to clear old data');
      try {
        // Clear old quiz data and retry
        clearLocalStorage();
        const data = {
          answers,
          currentQuestionIndex,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        };
        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
      } catch (retryError) {
        console.error('Failed to save quiz progress even after clearing old data:', retryError);
      }
    }
  }
};

const loadFromLocalStorage = () => {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const data = JSON.parse(stored);

    // Validate the loaded data
    if (!data || typeof data !== 'object') {
      console.warn('Invalid quiz progress data structure');
      clearLocalStorage(); // Clear corrupted data
      return null;
    }

    // Ensure we have the required properties
    const answers = Array.isArray(data.answers) ? data.answers : [];
    const currentQuestionIndex = typeof data.currentQuestionIndex === 'number' ? data.currentQuestionIndex : -1;

    return {
      answers,
      currentQuestionIndex
    };
  } catch (error) {
    console.warn('Failed to load quiz progress from localStorage:', error);

    // Clear corrupted data
    try {
      clearLocalStorage();
    } catch (clearError) {
      console.warn('Failed to clear corrupted quiz progress data:', clearError);
    }

    return null;
  }
};

const clearLocalStorage = () => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(QUIZ_STORAGE_KEY);
    }
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
  savedResults: null,
  isResultsRoute: false,
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

      case 'SAVE_RESULTS_TO_STORAGE':
        return {
          ...state,
          savedResults: action.payload,
        };

      case 'LOAD_RESULTS_FROM_STORAGE':
        return {
          ...state,
          savedResults: action.payload,
          results: action.payload,
        };

      case 'CLEAR_ACTIVE_RESULTS':
        return {
          ...state,
          results: null,
        };

      case 'SET_RESULTS_ROUTE':
        return {
          ...state,
          isResultsRoute: action.payload,
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
  goToQuestion: (index: number, skipNavigation?: boolean) => void;
  getAnswerForQuestion: (questionId: string) => QuizAnswer | undefined;
  loadAnswersFromJSON: (answers: QuizAnswer[]) => void;
  canSubmitQuiz: () => boolean;
  getIncompleteQuestions: () => string[];
  downloadAnswersAsJSON: () => void;
  saveResultsToStorage: (results: QuizResults) => void;
  loadResultsFromStorage: () => QuizResults | null;
  clearActiveResults: () => void;
  hasStoredResults: () => boolean;
  setResultsRoute: (isResultsRoute: boolean) => void;
  loadSavedProgress: () => boolean;
  loadSavedProgressSilent: () => boolean;
  hasSavedProgress: () => boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const navigate = useNavigate();

  // Don't automatically load from localStorage on mount
  // This prevents the quiz from auto-resuming when user refreshes the homepage
  // Instead, we'll provide a method to explicitly restore progress when needed

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
    const currentIndex = state.currentQuestionIndex;
    const nextIndex = currentIndex + 1;

    dispatch({ type: 'NEXT_QUESTION' });

    // Navigate to the next question URL if we're not at the end
    if (nextIndex < quizQuestions.length) {
      navigate(`/question/${nextIndex + 1}`);
    }
  };

  const previousQuestion = () => {
    const currentIndex = state.currentQuestionIndex;
    const prevIndex = currentIndex - 1;

    dispatch({ type: 'PREVIOUS_QUESTION' });

    // Navigate to the previous question URL if we're not at the beginning
    if (prevIndex >= 0) {
      navigate(`/question/${prevIndex + 1}`);
    } else {
      // If going before the first question, go to home
      navigate('/');
    }
  };

  const completeQuiz = async () => {
    dispatch({ type: 'COMPLETE_QUIZ' });

    // Calculate basic results first (without AI)
    try {
      const basicResults = await calculateQuizResults(state.answers, false);
      dispatch({ type: 'SET_RESULTS', payload: basicResults });

      // Save basic results to localStorage immediately
      const saveResult = safeSaveQuizResults(basicResults);
      if (saveResult.success) {
        dispatch({ type: 'SAVE_RESULTS_TO_STORAGE', payload: basicResults });
      } else {
        console.warn('Failed to save basic results to localStorage:', saveResult.error);
        // Continue with AI analysis even if storage fails
        // Could show a toast notification here if needed
      }

      // Mark this as a quiz completion navigation for proper state handling
      markQuizCompletionNavigation();

      // Navigate to results page after saving basic results
      // Use replace: false to ensure proper browser history
      navigate('/quiz-results', { replace: false });

      // Then enhance with AI analysis in the background
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

        // Save enhanced results to localStorage
        const enhancedSaveResult = safeSaveQuizResults(enhancedResults);
        if (enhancedSaveResult.success) {
          dispatch({ type: 'SAVE_RESULTS_TO_STORAGE', payload: enhancedResults });
        } else {
          console.warn('Failed to save enhanced results to localStorage:', enhancedSaveResult.error);
          // Results are still available in state even if storage fails
        }
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

  const resetQuizAndClearStorage = () => {
    // Clear quiz progress from localStorage
    clearLocalStorage();

    // Clear quiz results from localStorage
    try {
      clearQuizResults();
    } catch (error) {
      console.warn('Failed to clear quiz results from storage:', error);
      // Continue with reset even if clearing results fails
    }

    // Clear navigation state
    clearNavigationState();

    // Reset the quiz state
    dispatch({ type: 'RESET_QUIZ' });

    // Navigate back to home page
    navigate('/');
  };

  const goToQuestion = (index: number, skipNavigation = false) => {
    dispatch({ type: 'GOTO_QUESTION', payload: index });

    // Navigate to the appropriate question URL only if not skipping navigation
    if (!skipNavigation && index >= 0 && index < quizQuestions.length) {
      navigate(`/question/${index + 1}`);
    }
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

  const saveResultsToStorage = (results: QuizResults) => {
    try {
      saveQuizResults(results);
      dispatch({ type: 'SAVE_RESULTS_TO_STORAGE', payload: results });
    } catch (error) {
      console.error('Failed to save results to storage:', error);
      // Re-throw the error so calling components can handle it appropriately
      throw error;
    }
  };

  const loadResultsFromStorage = (): QuizResults | null => {
    try {
      const results = loadQuizResults();
      dispatch({ type: 'LOAD_RESULTS_FROM_STORAGE', payload: results });
      return results;
    } catch (error) {
      console.error('Failed to load results from storage:', error);
      // For loading, we return null instead of throwing to allow graceful degradation
      return null;
    }
  };

  const clearActiveResults = () => {
    dispatch({ type: 'CLEAR_ACTIVE_RESULTS' });
  };

  const hasStoredResults = (): boolean => {
    return hasStoredQuizResults();
  };

  const setResultsRoute = (isResultsRoute: boolean) => {
    dispatch({ type: 'SET_RESULTS_ROUTE', payload: isResultsRoute });
  };

  const loadSavedProgress = (): boolean => {
    const stored = loadFromLocalStorage();
    if (stored && stored.answers.length > 0) {
      dispatch({ type: 'LOAD_FROM_LOCALSTORAGE', payload: stored });

      // Navigate to the current question after loading progress
      const questionIndex = stored.currentQuestionIndex >= 0 ? stored.currentQuestionIndex : 0;
      navigate(`/question/${questionIndex + 1}`);

      return true;
    }
    return false;
  };

  const loadSavedProgressSilent = (): boolean => {
    const stored = loadFromLocalStorage();
    if (stored && stored.answers.length > 0) {
      dispatch({ type: 'LOAD_FROM_LOCALSTORAGE', payload: stored });
      return true;
    }
    return false;
  };

  const hasSavedProgress = (): boolean => {
    const stored = loadFromLocalStorage();
    return !!(stored && stored.answers.length > 0);
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
        resetQuizAndClearStorage,
        goToQuestion,
        getAnswerForQuestion,
        loadAnswersFromJSON,
        canSubmitQuiz,
        getIncompleteQuestions,
        downloadAnswersAsJSON,
        saveResultsToStorage,
        loadResultsFromStorage,
        clearActiveResults,
        hasStoredResults,
        setResultsRoute,
        loadSavedProgress,
        loadSavedProgressSilent,
        hasSavedProgress,
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
