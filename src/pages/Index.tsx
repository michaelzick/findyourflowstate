import { useQuiz } from '@/contexts/QuizContext';
import { QuizLanding } from '@/components/quiz/QuizLanding';
import { QuizInterface } from '@/components/quiz/QuizInterface';
import { QuizResults } from '@/components/quiz/QuizResults';
import { QuizLoadingModal } from '@/components/quiz/QuizLoadingModal';
import Footer from '@/components/Footer';
import { quizQuestions } from '@/data/quiz-questions';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

function QuizContent() {
  const { state } = useQuiz();

  // Show loading modal when quiz is complete but results are being processed
  const showLoadingModal = state.isComplete && (!state.results || state.isAiAnalysisLoading);

  if (state.isComplete && state.results && !state.isAiAnalysisLoading) {
    return (
      <>
        <QuizResults />
        <QuizLoadingModal isOpen={showLoadingModal} />
      </>
    );
  }

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
