import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizLanding } from '@/components/quiz/QuizLanding';
import { QuizLoadingModal } from '@/components/quiz/QuizLoadingModal';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

function QuizContent() {
  const { state } = useQuiz();
  const navigate = useNavigate();

  // Show loading modal when quiz is complete but results are being processed
  const showLoadingModal = state.isComplete && (!state.results || state.isAiAnalysisLoading);

  // Don't automatically redirect to quiz questions from homepage
  // Users should be able to return to homepage even with quiz progress
  // The "Continue Quiz" button will handle resuming the quiz

  // If quiz is complete, navigate to results
  useEffect(() => {
    if (state.isComplete && state.results && !state.isAiAnalysisLoading) {
      navigate('/quiz-results');
    }
  }, [state.isComplete, state.results, state.isAiAnalysisLoading, navigate]);

  // Only show landing page when quiz hasn't started
  return (
    <>
      <QuizLanding />
      <QuizLoadingModal isOpen={showLoadingModal} />
    </>
  );
}

const Index = () => {
  const { state } = useQuiz();

  // Scroll to top on route changes and when quiz state changes (like resets)
  useScrollToTop([state.currentQuestionIndex]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <QuizContent />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
