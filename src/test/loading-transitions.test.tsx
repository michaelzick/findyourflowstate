import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuizProvider } from '@/contexts/QuizContext';
import QuizResultsPage from '@/pages/QuizResultsPage';
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
describe('Loading States and Transitions Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Initial Loading State', () => {
    it('shows loading spinner and text initially', () => {
      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      expect(screen.getByText('Loading your results...')).toBeInTheDocument();

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-primary');
    });

    it('transitions from loading to action buttons smoothly', async () => {
      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      // Initially shows loading
      expect(screen.getByText('Loading your results...')).toBeInTheDocument();

      // Should transition to action buttons
      await waitFor(() => {
        expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
        expect(screen.getByText('Load Previous Results')).toBeInTheDocument();
      });

      // Loading should be gone
      expect(screen.queryByText('Loading your results...')).not.toBeInTheDocument();
    });
  });

  describe('Button Loading States', () => {
    it('shows loading state when processing actions', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Load Previous Results')).toBeInTheDocument();
      });

      const loadButton = screen.getByText('Load Previous Results');

      // Click should show immediate feedback
      await user.click(loadButton);

      // Button should be disabled during processing
      expect(loadButton).toBeDisabled();
    });
  });

  describe('Modal Transitions', () => {
    it('modals appear with smooth transitions', async () => {
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
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();

        // Check for transition classes
        expect(modal).toHaveClass('animate-in');
      });
    });

    it('modals disappear with smooth transitions', async () => {
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
      });

      await user.click(screen.getByText('OK'));

      await waitFor(() => {
        expect(screen.queryByText('No Previous Results')).not.toBeInTheDocument();
      });
    });
  });

  describe('State Transitions', () => {
    it('transitions between different page states smoothly', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      // Start with loading
      expect(screen.getByText('Loading your results...')).toBeInTheDocument();

      // Transition to action buttons
      await waitFor(() => {
        expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
      });

      // Open modal
      await user.click(screen.getByText('Start New Quiz'));

      await waitFor(() => {
        expect(screen.getByText('Reset Quiz Progress')).toBeInTheDocument();
      });

      // Close modal
      await user.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByText('Reset Quiz Progress')).not.toBeInTheDocument();
        expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
      });
    });
  });

  describe('Error State Transitions', () => {
    it('handles error states with proper loading indicators', async () => {
      // Mock storage error
      const { safeLoadQuizResults } = await import('@/utils/quiz-results-storage');
      vi.mocked(safeLoadQuizResults).mockReturnValue({
        results: null,
        error: new Error('Storage error'),
      });

      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      // Should still show loading initially
      expect(screen.getByText('Loading your results...')).toBeInTheDocument();

      // Should transition to action buttons despite error
      await waitFor(() => {
        expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
      });
    });
  });

  describe('Performance Optimizations', () => {
    it('does not cause unnecessary re-renders', async () => {
      const renderSpy = vi.fn();

      const TestComponent = () => {
        renderSpy();
        return <QuizResultsPage />;
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
      });

      // Should not render excessively
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('handles rapid state changes gracefully', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Load Previous Results')).toBeInTheDocument();
      });

      const loadButton = screen.getByText('Load Previous Results');

      // Rapid clicks should not cause issues
      await user.click(loadButton);
      await user.click(loadButton);
      await user.click(loadButton);

      // Should still show modal properly
      await waitFor(() => {
        expect(screen.getByText('No Previous Results')).toBeInTheDocument();
      });
    });
  });
});
