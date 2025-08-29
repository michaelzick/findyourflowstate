import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizInterface } from '@/components/quiz/QuizInterface';
import { QuizLoadingModal } from '@/components/quiz/QuizLoadingModal';
import { quizQuestions } from '@/data/quiz-questions';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function QuizQuestionPage() {
  const { questionNumber } = useParams<{ questionNumber: string }>();
  const navigate = useNavigate();
  const { state, goToQuestion, loadSavedProgressSilent } = useQuiz();

  useScrollToTop();

  const questionIndex = questionNumber ? parseInt(questionNumber) - 1 : 0;
  const isValidQuestion = questionIndex >= 0 && questionIndex < quizQuestions.length;

  useEffect(() => {
    // If invalid question number, redirect to home
    if (!isValidQuestion) {
      navigate('/');
      return;
    }

    // If quiz hasn't started (currentQuestionIndex is -1), try to load saved progress first
    if (state.currentQuestionIndex === -1) {
      // Try to load saved progress silently (without navigation)
      const progressLoaded = loadSavedProgressSilent();

      // If no saved progress was loaded, start at the requested question
      if (!progressLoaded) {
        goToQuestion(questionIndex, true); // Skip navigation since we're already on the correct URL
      }
      // If progress was loaded but doesn't match current URL, sync to current URL
      else {
        // The progress was loaded, but we need to sync to the current URL
        goToQuestion(questionIndex, true);
      }
    }
    // If the URL doesn't match the current question, sync them
    else if (state.currentQuestionIndex !== questionIndex) {
      goToQuestion(questionIndex, true); // Skip navigation since we're already on the correct URL
    }
  }, [questionIndex, isValidQuestion, navigate, state.currentQuestionIndex, goToQuestion, loadSavedProgressSilent]);

  // Show loading modal when quiz is complete but results are being processed
  const showLoadingModal = state.isComplete && (!state.results || state.isAiAnalysisLoading);

  // If quiz is complete, navigate to results
  useEffect(() => {
    if (state.isComplete && state.results && !state.isAiAnalysisLoading) {
      navigate('/quiz-results');
    }
  }, [state.isComplete, state.results, state.isAiAnalysisLoading, navigate]);

  if (!isValidQuestion) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <QuizInterface />
        <QuizLoadingModal isOpen={showLoadingModal} />
      </div>
      <Footer />
    </div>
  );
}
