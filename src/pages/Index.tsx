import React from 'react';
import { QuizProvider, useQuiz } from '@/contexts/QuizContext';
import { QuizLanding } from '@/components/quiz/QuizLanding';
import { QuizInterface } from '@/components/quiz/QuizInterface';
import { QuizResults } from '@/components/quiz/QuizResults';
import { quizQuestions } from '@/data/quiz-questions';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

function QuizContent() {
  const { state } = useQuiz();

  if (state.isComplete && state.results) {
    return <QuizResults />;
  }

  if (state.currentQuestionIndex === 0 && state.answers.length === 0) {
    return <QuizLanding />;
  }

  if (state.currentQuestionIndex < quizQuestions.length) {
    return <QuizInterface />;
  }

  return <QuizLanding />;
}

const Index = () => {
  useScrollToTop();

  return (
    <QuizProvider>
      <div className="min-h-screen bg-background">
        <QuizContent />
      </div>
    </QuizProvider>
  );
};

export default Index;
