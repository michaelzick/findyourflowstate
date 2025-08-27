import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { QuizResults } from '@/components/quiz/QuizResults';
import { ResultsActionButtons } from '@/components/quiz/ResultsActionButtons';
import { QuizResultsModals } from '@/components/quiz/QuizResultsModals';
import { useToast } from '@/hooks/use-toast';
import { safeLoadQuizResults } from '@/utils/quiz-results-storage';

export default function QuizResultsPage() {
  const { state, resetQuizAndClearStorage, setResultsRoute } = useQuiz();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Use scroll to top hook for this page
  useScrollToTop();

  // Set results route flag when component mounts
  useEffect(() => {
    setResultsRoute(true);
    return () => setResultsRoute(false);
  }, [setResultsRoute]);

  // Handle initial page load - run only once
  useEffect(() => {
    // Simple initialization logic
    if (state.results) {
      // We have results, show them
      setShowActionButtons(false);
    } else {
      // Try to load from storage
      const { results: storedResults } = safeLoadQuizResults();
      if (storedResults) {
        // Results found in storage, they should be loaded by the context
        setShowActionButtons(false);
      } else {
        // No results, show action buttons
        setShowActionButtons(true);
      }
    }
    setIsInitialLoading(false);
  }, [state.results]);

  // Handle starting a new quiz
  const handleStartNewQuiz = async () => {
    setShowResetModal(true);
  };

  // Handle confirmed reset from modal
  const handleConfirmReset = () => {
    try {
      resetQuizAndClearStorage();
      setShowResetModal(false);
      toast({
        title: "Quiz Reset",
        description: "Starting a fresh quiz. Your previous results have been cleared.",
      });
      navigate('/', { replace: false });
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
    const { results: storedResults } = safeLoadQuizResults();
    if (storedResults) {
      setShowActionButtons(false);
      toast({
        title: "Results Loaded",
        description: "Your previous quiz results have been loaded successfully.",
      });
    } else {
      setShowNoResultsModal(true);
    }
  };

  // Modal close handlers
  const handleCloseNoResultsModal = () => setShowNoResultsModal(false);
  const handleCloseResetModal = () => setShowResetModal(false);

  // Handle clearing results to show action buttons
  const handleClearResults = () => {
    setShowActionButtons(true);
  };

  // Show loading state
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center animate-in fade-in-0 duration-500">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading your results...</p>
            <p className="text-sm text-muted-foreground">Please wait while we prepare your quiz results</p>
          </div>
        </div>
      </div>
    );
  }

  // Show results if available
  if (state.results && !showActionButtons) {
    return (
      <>
        <QuizResults
          showClearButton={true}
          onClearResults={handleClearResults}
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

  // Show action buttons
  return (
    <>
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
