import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuizProvider } from '@/contexts/QuizContext';
import QuizResultsPage from '@/pages/QuizResultsPage';
import Index from '@/pages/Index';
import { mockQuizResults } from './mocks/quiz-data';

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

// Mock the storage utilities
vi.mock('@/utils/quiz-results-storage', () => ({
  safeLoadQuizResults: vi.fn(() => ({ results: null, error: null })),
  safeSaveQuizResults: vi.fn(() => ({ success: true, error: null })),
  getStorageHealth: vi.fn(() => ({ isHealthy: true, issues: [] })),
  repairStorage: vi.fn(() => ({ success: true, repairedIssues: [] })),
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

describe('Complete User Flow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
  });

  describe('Quiz Results Page - Initial Load States', () => {
    it('shows action buttons when no results exist', async () => {
      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
        expect(screen.getByText('Load Previous Results')).toBeInTheDocument();
      });
    });

    it('shows loading state initially', () => {
      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      expect(screen.getByText('Loading your results...')).toBeInTheDocument();
    });
  });

  describe('Modal Interactions', () => {
    it('shows no results modal when loading previous results with no data', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Load Previous Results')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Load Previous Results'));

      await waitFor(() => {
        expect(screen.getByText('No Previous Results')).toBeInTheDocument();
        expect(screen.getByText('No previous quiz results were found. Please take the quiz first to see your results.')).toBeInTheDocument();
      });

      // Test modal close
      await user.click(screen.getByText('OK'));

      await waitFor(() => {
        expect(screen.queryByText('No Previous Results')).not.toBeInTheDocument();
      });
    });

    it('shows reset confirmation modal when starting new quiz', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Start New Quiz'));

      await waitFor(() => {
        expect(screen.getByText('Reset Quiz Progress')).toBeInTheDocument();
        expect(screen.getByText('This will clear all your current quiz progress and results. Are you sure you want to start over?')).toBeInTheDocument();
      });

      // Test modal cancel
      await user.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByText('Reset Quiz Progress')).not.toBeInTheDocument();
      });
    });
  });

  describe('Button Behaviors', () => {
    it('has proper button styling and accessibility', async () => {
      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        const startButton = screen.getByText('Start New Quiz');
        const loadButton = screen.getByText('Load Previous Results');

        expect(startButton).toBeInTheDocument();
        expect(loadButton).toBeInTheDocument();

        // Check accessibility attributes
        expect(startButton).toHaveAttribute('type', 'button');
        expect(loadButton).toHaveAttribute('type', 'button');
      });
    });

    it('handles button clicks without errors', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
      });

      // Test multiple clicks don't cause errors
      const startButton = screen.getByText('Start New Quiz');
      await user.click(startButton);
      await user.click(startButton);

      // Should still show modal
      expect(screen.getByText('Reset Quiz Progress')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders properly on mobile viewport', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });

      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        const container = screen.getByText('Start New Quiz').closest('.container');
        expect(container).toBeInTheDocument();
      });
    });

    it('renders properly on desktop viewport', async () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1080,
      });

      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
        expect(screen.getByText('Load Previous Results')).toBeInTheDocument();
      });
    });
  });
});
