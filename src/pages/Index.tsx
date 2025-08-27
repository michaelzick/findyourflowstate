import { useQuiz } from '@/contexts/QuizContext';
import { QuizLanding } from '@/components/quiz/QuizLanding';
import { QuizInterface } from '@/components/quiz/QuizInterface';
import { QuizLoadingModal } from '@/components/quiz/QuizLoadingModal';
import Footer from '@/components/Footer';
import { quizQuestions } from '@/data/quiz-questions';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

function QuizContent() {
  const { state } = useQuiz();

  // Show loading modal when quiz is complete but results are being processed
  const showLoadingModal = state.isComplete && (!state.results || state.isAiAnalysisLoading);

  // When quiz is complete, we navigate to /quiz-results instead of showing results inline
  // So we only show the loading modal during processing, then navigation happens

  if (state.currentQuestionIndex === -1) {
    return (
      <>
        <QuizLanding />
        <QuizLoadingModal isOpen={showLoadingModal} />
      </>
    );
  }

  if (state.currentQuestionIndex < quizQuestions.length) {
    return (
      <>
        <QuizInterface />
        <QuizLoadingModal isOpen={showLoadingModal} />
      </>
    );
  }

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
