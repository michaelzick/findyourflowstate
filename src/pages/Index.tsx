import React from 'react';
import { QuizProvider, useQuiz } from '@/contexts/QuizContext';
import { QuizLanding } from '@/components/quiz/QuizLanding';
import { QuizInterface } from '@/components/quiz/QuizInterface';
import { QuizResults } from '@/components/quiz/QuizResults';
import Footer from '@/components/Footer';
import { quizQuestions } from '@/data/quiz-questions';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

function QuizContent() {
  const { state } = useQuiz();

  if (state.isComplete && state.results) {
    return <QuizResults />;
  }

  if (state.currentQuestionIndex === -1) {
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
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1">
          <QuizContent />
        </div>
        <Footer />
      </div>
    </QuizProvider>
  );
};

export default Index;
