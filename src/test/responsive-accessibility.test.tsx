import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuizProvider } from '@/contexts/QuizContext';
import QuizResultsPage from '@/pages/QuizResultsPage';
import { ResultsActionButtons } from '@/components/quiz/ResultsActionButtons';

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

// Helper function to simulate viewport changes
const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

describe('Responsive Design Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Mobile Viewport (375px)', () => {
    beforeEach(() => {
      setViewport(375, 667);
    });

    it('renders action buttons properly on mobile', async () => {
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

        // Check that buttons are stacked vertically on mobile
        const container = startButton.closest('.flex');
        expect(container).toHaveClass('flex-col', 'sm:flex-row');
      });
    });

    it('has proper spacing and padding on mobile', async () => {
      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        const container = screen.getByText('Start New Quiz').closest('.container');
        expect(container).toHaveClass('px-4');
      });
    });

    it('modals are properly sized for mobile', async () => {
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

        // Check modal has proper mobile styling
        const modalContent = modal.querySelector('[role="dialog"]');
        expect(modalContent).toHaveClass('sm:max-w-lg');
      });
    });
  });

  describe('Tablet Viewport (768px)', () => {
    beforeEach(() => {
      setViewport(768, 1024);
    });

    it('renders properly on tablet', async () => {
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
      });
    });

    it('has proper button layout on tablet', async () => {
      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        const container = screen.getByText('Start New Quiz').closest('.flex');
        expect(container).toHaveClass('sm:flex-row');
      });
    });
  });

  describe('Desktop Viewport (1920px)', () => {
    beforeEach(() => {
      setViewport(1920, 1080);
    });

    it('renders properly on desktop', async () => {
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
      });
    });

    it('has proper max-width constraints on desktop', async () => {
      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        const container = screen.getByText('Start New Quiz').closest('.container');
        expect(container).toHaveClass('max-w-2xl');
      });
    });
  });
});

describe('Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Keyboard Navigation', () => {
    it('supports tab navigation through buttons', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
      });

      const startButton = screen.getByText('Start New Quiz');
      const loadButton = screen.getByText('Load Previous Results');

      // Tab to first button
      await user.tab();
      expect(startButton).toHaveFocus();

      // Tab to second button
      await user.tab();
      expect(loadButton).toHaveFocus();
    });

    it('supports Enter key activation', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
      });

      const startButton = screen.getByText('Start New Quiz');
      startButton.focus();

      // Press Enter
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Reset Quiz Progress')).toBeInTheDocument();
      });
    });

    it('supports Space key activation', async () => {
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
      loadButton.focus();

      // Press Space
      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByText('No Previous Results')).toBeInTheDocument();
      });
    });
  });

  describe('ARIA Attributes', () => {
    it('has proper button roles and attributes', async () => {
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

        expect(startButton).toHaveAttribute('role', 'button');
        expect(loadButton).toHaveAttribute('role', 'button');
      });
    });

    it('has proper modal accessibility attributes', async () => {
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
        expect(modal).toHaveAttribute('aria-modal', 'true');
        expect(modal).toHaveAttribute('role', 'dialog');
      });
    });

    it('has proper loading state accessibility', () => {
      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      const loadingText = screen.getByText('Loading your results...');
      expect(loadingText).toBeInTheDocument();

      // Check for loading indicator
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Screen Reader Support', () => {
    it('has descriptive button text', async () => {
      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        const startButton = screen.getByText('Start New Quiz');
        const loadButton = screen.getByText('Load Previous Results');

        // Button text should be descriptive
        expect(startButton.textContent).toBe('Start New Quiz');
        expect(loadButton.textContent).toBe('Load Previous Results');
      });
    });

    it('has proper heading structure', async () => {
      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      // Check for proper heading hierarchy in modals
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.getByText('Load Previous Results')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Load Previous Results'));

      await waitFor(() => {
        const heading = screen.getByText('No Previous Results');
        expect(heading.tagName).toBe('H2');
      });
    });
  });

  describe('Focus Management', () => {
    it('manages focus properly when opening modals', async () => {
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
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();

        // Focus should be trapped within modal
        const cancelButton = screen.getByText('Cancel');
        expect(document.activeElement).toBe(cancelButton);
      });
    });

    it('restores focus when closing modals', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <QuizResultsPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Start New Quiz')).toBeInTheDocument();
      });

      const startButton = screen.getByText('Start New Quiz');
      await user.click(startButton);

      await waitFor(() => {
        expect(screen.getByText('Reset Quiz Progress')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByText('Reset Quiz Progress')).not.toBeInTheDocument();
        // Focus should return to the button that opened the modal
        expect(document.activeElement).toBe(startButton);
      });
    });
  });
});
