import React from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { quizQuestions } from '@/data/quiz-questions';
import { QuizQuestion } from './QuizQuestion';
import { QuizProgress } from './QuizProgress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function QuizInterface() {
  const { 
    state, 
    answerQuestion, 
    nextQuestion, 
    previousQuestion, 
    completeQuiz, 
    getAnswerForQuestion,
    canSubmitQuiz,
    getIncompleteQuestions
  } = useQuiz();
  const { toast } = useToast();
  const currentQuestion = quizQuestions[state.currentQuestionIndex];
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
      {/* Header with Progress */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <QuizProgress
            currentQuestion={state.currentQuestionIndex}
            totalQuestions={quizQuestions.length}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
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
    </div>
  );
}
