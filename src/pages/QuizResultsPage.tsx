import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { useBrowserNavigation } from '@/hooks/use-browser-navigation';
import { QuizResults } from '@/components/quiz/QuizResults';
import { ResultsActionButtons } from '@/components/quiz/ResultsActionButtons';
import { QuizResultsModals } from '@/components/quiz/QuizResultsModals';
import { StorageErrorRecovery } from '@/components/quiz/StorageErrorRecovery';
import { useToast } from '@/hooks/use-toast';
import {
  saveNavigationState,
  loadNavigationState,
  clearNavigationState,
  isDirectNavigation,
  markActionButtonsNavigation
} from '@/utils/navigation-state';
import {
  safeLoadQuizResults,
  QuizResultsStorageError,
  StorageError,
  getStorageHealth,
  repairStorage
} from '@/utils/quiz-results-storage';

export default function QuizResultsPage() {
  const {
    state,
    loadResultsFromStorage,
    resetQuizAndClearStorage,
    setResultsRoute
  } = useQuiz();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [storageError, setStorageError] = useState<QuizResultsStorageError | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Use scroll to top hook for this page
  useScrollToTop();

  // Simplified navigation - remove complex browser integration for now
  const navigateWithHistory = (path: string, options?: { replace?: boolean }) => {
    navigate(path, options);
  };

  // Set results route flag when component mounts
  useEffect(() => {
    setResultsRoute(true);

    // Cleanup when component unmounts
    return () => {
      setResultsRoute(false);
    };
  }, [setResultsRoute]); // Include setResultsRoute in dependency array

  // Handle initial page load logic - run only once
  useEffect(() => {
    let mounted = true;

    const initializePage = () => {
      // If we have active results in state, show them
      if (state.results) {
        if (mounted) {
          setShowActionButtons(false);
          setIsInitialLoading(false);
        }
        return;
      }

      // Try to load from storage using the context function
      try {
        const storedResults = loadResultsFromStorage();

        if (mounted) {
          if (storedResults) {
            setShowActionButtons(false);
            setIsInitialLoading(false);
          } else {
            // No results available, show action buttons
            setShowActionButtons(true);
            setIsInitialLoading(false);
          }
        }
      } catch (error) {
        console.error('Failed to load results from storage:', error);
        if (mounted) {
          setShowActionButtons(true);
          setIsInitialLoading(false);
        }
      }
    };

    initializePage();

    return () => {
      mounted = false;
    };
  }, [loadResultsFromStorage, state.results]); // Include loadResultsFromStorage in dependencies

  // Handle when results are loaded after initial load (e.g., from quiz completion)
  useEffect(() => {
    if (!isInitialLoading && state.results) {
      setShowActionButtons(false);
    }
  }, [state.results, isInitialLoading]);

  // Handle starting a new quiz - show confirmation modal
  const handleStartNewQuiz = async () => {
    return new Promise<void>((resolve) => {
      setShowResetModal(true);
      resolve();
    });
  };

  // Handle confirmed reset from modal
  const handleConfirmReset = () => {
    try {
      resetQuizAndClearStorage();
      setShowResetModal(false);
      setShowActionButtons(false);
      toast({
        title: "Quiz Reset",
        description: "Starting a fresh quiz. Your previous results have been cleared.",
      });
      // Navigate back to homepage with proper history management
      navigateWithHistory('/', { replace: false });
    } catch (error) {
      console.error('Failed to reset quiz:', error);
      setShowResetModal(false);
      toast({
        title: "Error",
        description: "Failed to reset quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle loading previous results
  const handleLoadPrevious = async () => {
    return new Promise<void>((resolve) => {
      // Add a small delay to show loading state
      setTimeout(() => {
        try {
          const storedResults = loadResultsFromStorage();

          if (storedResults) {
            setShowActionButtons(false);
            // Update navigation state to reflect results are loaded
            saveNavigationState({
              hasResults: true,
              showActionButtons: false
            });
            toast({
              title: "Results Loaded",
              description: "Your previous quiz results have been loaded successfully.",
            });
          } else {
            // No results found
            setShowNoResultsModal(true);
          }
        } catch (error) {
          console.error('Failed to load results:', error);
          toast({
            title: "Error",
            description: "Failed to load previous results. Please try again.",
            variant: "destructive",
          });
        }
        resolve();
      }, 800); // Small delay to show loading state
    });
  };

  // Modal close handlers
  const handleCloseNoResultsModal = () => {
    setShowNoResultsModal(false);
  };

  const handleCloseResetModal = () => {
    setShowResetModal(false);
  };

  // Handle storage error recovery
  const handleRecoverStorage = async () => {
    setIsRecovering(true);

    try {
      const repairResult = repairStorage();

      if (repairResult.success) {
        setStorageError(null);
        toast({
          title: "Storage Repaired",
          description: "Storage issues have been resolved. You can now try loading your results again.",
        });

        // Try to load results again after repair
        try {
          const results = loadResultsFromStorage();
          if (results) {
            setShowActionButtons(false);
            saveNavigationState({
              hasResults: true,
              showActionButtons: false
            });
          }
        } catch (error) {
          console.error('Failed to load results after repair:', error);
        }
      } else {
        toast({
          title: "Recovery Failed",
          description: "Unable to fully repair storage. Some data may have been cleared.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Storage recovery failed:', error);
      toast({
        title: "Recovery Failed",
        description: "An error occurred while trying to repair storage.",
        variant: "destructive",
      });
    } finally {
      setIsRecovering(false);
    }
  };

  // Show action buttons if no results are available
  if (showActionButtons) {
    return (
      <>
        {/* Show storage error recovery if there's a recoverable error */}
        {storageError && storageError.isRecoverable() && (
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <StorageErrorRecovery
              error={storageError}
              onRecover={handleRecoverStorage}
              onDismiss={() => setStorageError(null)}
              isRecovering={isRecovering}
            />
          </div>
        )}

        <ResultsActionButtons
          onStartNewQuiz={handleStartNewQuiz}
          onLoadPrevious={handleLoadPrevious}
          isLoading={false}
        />
        <QuizResultsModals
          showNoResultsModal={showNoResultsModal}
          onCloseNoResultsModal={handleCloseNoResultsModal}
          showResetModal={showResetModal}
          onCloseResetModal={handleCloseResetModal}
          onConfirmReset={handleConfirmReset}
        />
      </>
    );
  }

  // Handle clearing results to show action buttons
  const handleClearResults = () => {
    setShowActionButtons(true);
    // Update navigation state to reflect action buttons are shown
    markActionButtonsNavigation();
  };

  // Show results if available and not showing action buttons
  if (state.results && !showActionButtons) {
    return (
      <>
        <QuizResults
          showClearButton={true}
        />
        <QuizResultsModals
          showNoResultsModal={showNoResultsModal}
          onCloseNoResultsModal={handleCloseNoResultsModal}
          showResetModal={showResetModal}
          onCloseResetModal={handleCloseResetModal}
          onConfirmReset={handleConfirmReset}
        />
      </>
    );
  }

  // Loading state while determining what to show
  if (isInitialLoading) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center animate-in fade-in-0 duration-500">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-t-primary/40 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">Loading your results...</p>
              <p className="text-sm text-muted-foreground">Please wait while we prepare your quiz results</p>
            </div>
          </div>
        </div>
        <QuizResultsModals
          showNoResultsModal={showNoResultsModal}
          onCloseNoResultsModal={handleCloseNoResultsModal}
          showResetModal={showResetModal}
          onCloseResetModal={handleCloseResetModal}
          onConfirmReset={handleConfirmReset}
        />
      </>
    );
  }

  // Fallback - should not reach here in normal flow
  return null;
}
