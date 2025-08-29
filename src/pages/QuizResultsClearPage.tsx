import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { ResultsActionButtons } from '@/components/quiz/ResultsActionButtons';
import { QuizResultsModals } from '@/components/quiz/QuizResultsModals';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function QuizResultsClearPage() {
  const { state, resetQuizAndClearStorage, loadResultsFromStorage } = useQuiz();
  const navigate = useNavigate();
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useScrollToTop();

  useEffect(() => {
    // Set the resultsRoute flag to indicate we're on a results route
    // This is handled by the QuizContext internally
  }, []);

  const handleStartNewQuiz = () => {
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    setIsLoading(true);
    resetQuizAndClearStorage();
    setShowResetModal(false);
    navigate('/');
  };

  const handleLoadPrevious = async () => {
    setIsLoading(true);
    const results = loadResultsFromStorage();
    setIsLoading(false);
    
    if (results) {
      navigate('/quiz-results');
    } else {
      setShowNoResultsModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ResultsActionButtons
        onStartNewQuiz={handleStartNewQuiz}
        onLoadPrevious={handleLoadPrevious}
        isLoading={isLoading}
      />
      
      <QuizResultsModals 
        showNoResultsModal={showNoResultsModal}
        onCloseNoResultsModal={() => setShowNoResultsModal(false)}
        showResetModal={showResetModal}
        onCloseResetModal={() => setShowResetModal(false)}
        onConfirmReset={handleConfirmReset}
      />
    </div>
  );
}