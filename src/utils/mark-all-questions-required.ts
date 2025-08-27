// Utility script to mark all questions as required
// This updates the quiz questions to make all questions required by default

import { quizQuestions } from '@/data/quiz-questions';

// Mark all questions as required by default (except those explicitly marked as optional)
export const updateQuizQuestionsToRequired = () => {
  return quizQuestions.map(question => ({
    ...question,
    required: question.required !== false // All questions required unless explicitly set to false
  }));
};