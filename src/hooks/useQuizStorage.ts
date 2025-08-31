import { useCallback } from 'react';
import { QuizAnswer, QuizResults } from '@/types/quiz';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '@/utils/localStorage';
import { 
  saveQuizResults, 
  loadQuizResults, 
  clearQuizResults,
  safeSaveQuizResults,
  safeLoadQuizResults 
} from '@/utils/quiz-results-storage';

interface QuizProgress {
  answers: QuizAnswer[];
  currentQuestionIndex: number;
}

/**
 * Custom hook for managing quiz data storage
 */
export const useQuizStorage = () => {
  const saveProgress = useCallback((answers: QuizAnswer[], currentQuestionIndex: number): boolean => {
    const progressData: QuizProgress = {
      answers,
      currentQuestionIndex,
    };
    
    return setStorageItem(STORAGE_KEYS.QUIZ_PROGRESS, progressData);
  }, []);

  const loadProgress = useCallback((): QuizProgress | null => {
    return getStorageItem<QuizProgress>(STORAGE_KEYS.QUIZ_PROGRESS);
  }, []);

  const clearProgress = useCallback((): void => {
    removeStorageItem(STORAGE_KEYS.QUIZ_PROGRESS);
  }, []);

  const hasProgress = useCallback((): boolean => {
    const progress = loadProgress();
    return !!(progress && progress.answers.length > 0);
  }, [loadProgress]);

  const saveResults = useCallback((results: QuizResults): { success: boolean; error?: string } => {
    const result = safeSaveQuizResults(results);
    return { 
      success: result.success, 
      error: result.error?.getUserFriendlyMessage() 
    };
  }, []);

  const loadResults = useCallback((): { results: QuizResults | null; error?: string } => {
    const result = safeLoadQuizResults();
    return { 
      results: result.results, 
      error: result.error?.getUserFriendlyMessage() 
    };
  }, []);

  const clearResults = useCallback((): void => {
    try {
      clearQuizResults();
    } catch (error) {
      console.warn('Failed to clear quiz results:', error);
    }
  }, []);

  return {
    saveProgress,
    loadProgress,
    clearProgress,
    hasProgress,
    saveResults,
    loadResults,
    clearResults,
  };
};