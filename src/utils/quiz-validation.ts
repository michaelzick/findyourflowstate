import { QuizAnswer } from '@/types/quiz';
import { quizQuestions } from '@/data/quiz-questions';

export const validateQuizCompleteness = (answers: QuizAnswer[]) => {
  const requiredQuestions = quizQuestions.filter(q => q.required !== false);
  const incompleteQuestions: string[] = [];
  
  requiredQuestions.forEach(question => {
    const answer = answers.find(a => a.questionId === question.id);
    if (!answer || answer.value === '' || answer.value === null || answer.value === undefined) {
      incompleteQuestions.push(question.question);
    }
  });
  
  return {
    isComplete: incompleteQuestions.length === 0,
    incompleteQuestions,
    totalRequired: requiredQuestions.length,
    completed: requiredQuestions.length - incompleteQuestions.length
  };
};

export const formatAnswersForDownload = (answers: QuizAnswer[]) => {
  return {
    timestamp: new Date().toISOString(),
    totalQuestions: answers.length,
    format: "Lovable Career Assessment Answers",
    version: "1.0",
    answers: answers.map(answer => ({
      questionId: answer.questionId,
      value: answer.value
    }))
  };
};