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

    // Always ensure we're on the correct question for the URL
    // This handles both fresh page loads and navigation
    if (state.currentQuestionIndex !== questionIndex) {
      // Try to load saved progress first if quiz hasn't started
      if (state.currentQuestionIndex === -1) {
        const progressLoaded = loadSavedProgressSilent();
        // If progress was loaded but doesn't match URL, or no progress, go to URL question
        if (!progressLoaded || state.currentQuestionIndex !== questionIndex) {
          goToQuestion(questionIndex, true);
        }
      } else {
        // Quiz is active but URL doesn't match current question, sync to URL
        goToQuestion(questionIndex, true);
      }
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

  // Show loading state while quiz context is initializing
  if (state.currentQuestionIndex === -1) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-t-primary/40 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading question {questionNumber}...</p>
            <p className="text-sm text-muted-foreground">Please wait while we prepare your quiz</p>
          </div>
        </div>
      </div>
    );
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
