import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuizProvider } from '@/contexts/QuizContext';
import QuizResultsPage from '@/pages/QuizResultsPage';

// Mock all external dependencies
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

describe('Quiz Results Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the quiz results page successfully', async () => {
    render(
      <TestWrapper>
        <QuizResultsPage />
      </TestWrapper>
    );

    // Should show loading initially
    expect(screen.getByText('Loading your results...')).toBeInTheDocument();

    // Should transition to action buttons
    await waitFor(() => {
      expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
      expect(screen.getByText('Load Previous Results')).toBeInTheDocument();
    });
  });

  it('handles button interactions correctly', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <QuizResultsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
    });

    // Test Start New Quiz button
    await user.click(screen.getByText('Start New Quiz'));

    await waitFor(() => {
      expect(screen.getByText('Reset Quiz Progress')).toBeInTheDocument();
    });

    // Close modal
    await user.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByText('Reset Quiz Progress')).not.toBeInTheDocument();
    });

    // Test Load Previous Results button
    await user.click(screen.getByText('Load Previous Results'));

    await waitFor(() => {
      expect(screen.getByText('No Previous Results')).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', async () => {
    render(
      <TestWrapper>
        <QuizResultsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const startButton = screen.getByText('Start New Quiz');
      const loadButton = screen.getByText('Load Previous Results');

      expect(startButton).toHaveAttribute('type', 'button');
      expect(loadButton).toHaveAttribute('type', 'button');
    });
  });
});
