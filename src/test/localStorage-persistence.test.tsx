import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuizProvider } from '@/contexts/QuizContext';
import QuizResultsPage from '@/pages/QuizResultsPage';
import { mockQuizResults, mockCorruptedResults } from './mocks/quiz-data';
import {
  safeLoadQuizResults,
  safeSaveQuizResults,
  QuizResultsStorageError,
  StorageError
} from '@/utils/quiz-results-storage';

// Mock the hooks
vi.mock('@/hooks/use-scroll-to-top', () => ({
  useScrollToTop: vi.fn(),
}));

vi.mock('@/hooks/use-browser-navigation', () => ({
  useBrowserNavigation: vi.fn(() => ({
    navigateWithHistory: vi.fn(),
    currentPath: '/quiz-results',
  })),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

vi.mock('@/utils/navigation-state', () => ({
  saveNavigationState: vi.fn(),
  loadNavigationState: vi.fn(() => null),
  clearNavigationState: vi.fn(),
  isDirectNavigation: vi.fn(() => true),
  markActionButtonsNavigation: vi.fn(),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <QuizProvider>
          {children}
        </QuizProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('LocalStorage Persistence Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Saving Quiz Results', () => {
    it('saves results to localStorage successfully', () => {
      const result = safeSaveQuizResults(mockQuizResults);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();

      // Verify data was saved
      const saved = localStorage.getItem('career-quiz-results');
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved!);
      expect(parsed.results).toEqual(mockQuizResults);
      expect(parsed.timestamp).toBeTruthy();
      expect(parsed.version).toBeTruthy();
    });

    it('handles localStorage quota exceeded error', () => {
      // Mock localStorage to throw quota exceeded error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      });

      const result = safeSaveQuizResults(mockQuizResults);

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(QuizResultsStorageError);
      expect(result.error?.type).toBe(StorageError.QUOTA_EXCEEDED);

      // Restore original method
      localStorage.setItem = originalSetItem;
    });

    it('handles localStorage unavailable error', () => {
      // Mock localStorage to be undefined
      const originalLocalStorage = window.localStorage;
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      });

      const result = safeSaveQuizResults(mockQuizResults);

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(QuizResultsStorageError);
      expect(result.error?.type).toBe(StorageError.UNAVAILABLE);

      // Restore original localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
      });
    });
  });

  describe('Loading Quiz Results', () => {
    it('loads valid results from localStorage', () => {
      // First save some results
      safeSaveQuizResults(mockQuizResults);

      // Then load them
      const result = safeLoadQuizResults();

      expect(result.results).toEqual(mockQuizResults);
      expect(result.error).toBeNull();
    });

    it('handles corrupted data in localStorage', () => {
      // Save corrupted data directly
      localStorage.setItem('career-quiz-results', 'invalid json');

      const result = safeLoadQuizResults();

      expect(result.results).toBeNull();
      expect(result.error).toBeInstanceOf(QuizResultsStorageError);
      expect(result.error?.type).toBe(StorageError.CORRUPTED_DATA);
    });

    it('handles missing data in localStorage', () => {
      const result = safeLoadQuizResults();

      expect(result.results).toBeNull();
      expect(result.error).toBeNull();
    });

    it('handles incomplete results data', () => {
      // Save incomplete data
      const incompleteData = {
        results: { answers: {} }, // Missing required fields
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
      localStorage.setItem('career-quiz-results', JSON.stringify(incompleteData));

      const result = safeLoadQuizResults();

      expect(result.results).toBeNull();
      expect(result.error).toBeInstanceOf(QuizResultsStorageError);
      expect(result.error?.type).toBe(StorageError.CORRUPTED_DATA);
    });
  });

  describe('Cross-Session Persistence', () => {
    it('maintains data across browser sessions', () => {
      // Save results
      safeSaveQuizResults(mockQuizResults);

      // Simulate browser restart by clearing memory but keeping localStorage
      const savedData = localStorage.getItem('career-quiz-results');

      // Verify data persists
      expect(savedData).toBeTruthy();

      // Load results after "restart"
      const result = safeLoadQuizResults();
      expect(result.results).toEqual(mockQuizResults);
    });

    it('handles version mismatches gracefully', () => {
      // Save data with old version
      const oldVersionData = {
        results: mockQuizResults,
        timestamp: new Date().toISOString(),
        version: '0.1.0', // Old version
      };
      localStorage.setItem('career-quiz-results', JSON.stringify(oldVersionData));

      const result = safeLoadQuizResults();

      // Should still load the results (backward compatibility)
      expect(result.results).toEqual(mockQuizResults);
      expect(result.error).toBeNull();
    });
  });

  describe('Data Validation', () => {
    it('validates required fields in results', () => {
      const invalidResults = {
        // Missing required fields like answers, scores, etc.
        completedAt: new Date().toISOString(),
      };

      const result = safeSaveQuizResults(invalidResults as QuizResults);

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(QuizResultsStorageError);
      expect(result.error?.type).toBe(StorageError.VALIDATION_FAILED);
    });

    it('validates timestamp format', () => {
      const dataWithInvalidTimestamp = {
        results: mockQuizResults,
        timestamp: 'invalid-date',
        version: '1.0.0',
      };
      localStorage.setItem('career-quiz-results', JSON.stringify(dataWithInvalidTimestamp));

      const result = safeLoadQuizResults();

      expect(result.results).toBeNull();
      expect(result.error).toBeInstanceOf(QuizResultsStorageError);
      expect(result.error?.type).toBe(StorageError.CORRUPTED_DATA);
    });
  });

  describe('Error Recovery', () => {
    it('clears corrupted data and allows fresh start', () => {
      // Save corrupted data
      localStorage.setItem('career-quiz-results', 'corrupted');

      // Try to load (should fail)
      const loadResult = safeLoadQuizResults();
      expect(loadResult.results).toBeNull();
      expect(loadResult.error?.type).toBe(StorageError.CORRUPTED_DATA);

      // Save new valid data (should work)
      const saveResult = safeSaveQuizResults(mockQuizResults);
      expect(saveResult.success).toBe(true);

      // Load should now work
      const newLoadResult = safeLoadQuizResults();
      expect(newLoadResult.results).toEqual(mockQuizResults);
    });
  });
});
