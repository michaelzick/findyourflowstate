import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { quizQuestions } from '@/data/quiz-questions';
import { QuizQuestion } from './QuizQuestion';
import { QuizProgress } from './QuizProgress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function QuizInterface() {
  const {
    state,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    getAnswerForQuestion,
    canSubmitQuiz,
    getIncompleteQuestions,
    resetQuizAndClearStorage
  } = useQuiz();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const { toast } = useToast();

  // Guard against invalid question index
  if (state.currentQuestionIndex < 0 || state.currentQuestionIndex >= quizQuestions.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading question...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quizQuestions[state.currentQuestionIndex];

  const handleReset = () => {
    resetQuizAndClearStorage();
    setShowResetDialog(false);
    toast({
      title: "Quiz Reset",
      description: "All progress and saved data have been cleared. Starting fresh!",
    });
  };
  const currentAnswer = getAnswerForQuestion(currentQuestion.id);
  const isLastQuestion = state.currentQuestionIndex === quizQuestions.length - 1;
  const isFirstQuestion = state.currentQuestionIndex === 0;

  const handleNext = async () => {
    if (!canProceed) {
      toast({
        title: "Answer Required",
        description: "Please answer this question before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (isLastQuestion && !allQuestionsComplete) {
      toast({
        title: "Quiz Incomplete",
        description: `Please complete all questions. ${incompleteQuestions.length} questions remaining.`,
        variant: "destructive",
      });
      return;
    }

    if (isLastQuestion) {
      await completeQuiz();
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      previousQuestion();
    }
  };

  const canProceed = currentAnswer && (currentAnswer.value !== '' && currentAnswer.value !== null && currentAnswer.value !== undefined);
  const allQuestionsComplete = canSubmitQuiz();
  const incompleteQuestions = getIncompleteQuestions();
  const showEarlySubmit = state.hasUploadedAnswers && allQuestionsComplete;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back to Home Button - Fixed position at top-left */}
      <div className="absolute top-4 left-4 z-20">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Header with Progress */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 pt-12 pb-6">
          <QuizProgress
            currentQuestion={state.currentQuestionIndex}
            totalQuestions={quizQuestions.length}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Reset Link */}
          <div className="mb-6 text-center">
            <button
              onClick={() => setShowResetDialog(true)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mx-auto"
            >
              <RotateCcw className="h-4 w-4" />
              Reset and start over
            </button>
          </div>

          <QuizQuestion
            question={currentQuestion}
            answer={currentAnswer}
            onAnswer={answerQuestion}
            className="mb-8"
          />

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {currentQuestion.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>

            <div className="flex flex-col items-end gap-2">
              {showEarlySubmit && (
                <Button
                  onClick={completeQuiz}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit Quiz Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                {isLastQuestion ? 'Complete Quiz' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
              {!canProceed && (
                <p className="text-sm text-red-500 text-right">
                  This question is required
                </p>
              )}
              {isLastQuestion && !allQuestionsComplete && (
                <p className="text-sm text-red-500 text-right max-w-xs">
                  Complete all questions to submit: {incompleteQuestions.length} remaining
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Quiz Progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your current answers and progress. You'll start from the beginning. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
              Reset Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
