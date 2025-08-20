import React from 'react';
import { useQuiz } from '@/contexts/QuizContext';
import { quizQuestions } from '@/data/quiz-questions';
import { QuizQuestion } from './QuizQuestion';
import { QuizProgress } from './QuizProgress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function QuizInterface() {
  const { state, answerQuestion, nextQuestion, previousQuestion, completeQuiz, getAnswerForQuestion } = useQuiz();
  const { toast } = useToast();
  const currentQuestion = quizQuestions[state.currentQuestionIndex];
  const currentAnswer = getAnswerForQuestion(currentQuestion.id);
  const isLastQuestion = state.currentQuestionIndex === quizQuestions.length - 1;
  const isFirstQuestion = state.currentQuestionIndex === 0;

  const handleNext = () => {
    if (currentQuestion.required && !currentAnswer) {
      toast({
        title: "Required Question",
        description: "Please answer this question before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (isLastQuestion) {
      completeQuiz();
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      previousQuestion();
    }
  };

  const canProceed = !currentQuestion.required || currentAnswer;

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

            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center gap-2 bg-quiz-gradient hover:opacity-90"
            >
              {isLastQuestion ? 'Complete Quiz' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}