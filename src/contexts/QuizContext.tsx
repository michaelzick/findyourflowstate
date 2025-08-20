import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizAnswer, QuizResults } from '@/types/quiz';
import { calculateQuizResults } from '@/utils/quiz-scoring';

interface QuizState {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  results: QuizResults | null;
  isComplete: boolean;
}

type QuizAction =
  | { type: 'ANSWER_QUESTION'; payload: QuizAnswer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ' }
  | { type: 'GOTO_QUESTION'; payload: number };

const initialState: QuizState = {
  currentQuestionIndex: -1,
  answers: [],
  results: null,
  isComplete: false,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
      case 'ANSWER_QUESTION': {
        const existingAnswerIndex = state.answers.findIndex(
          a => a.questionId === action.payload.questionId
        );

        let newAnswers;
        if (existingAnswerIndex >= 0) {
          newAnswers = [...state.answers];
          newAnswers[existingAnswerIndex] = action.payload;
        } else {
          newAnswers = [...state.answers, action.payload];
        }

        return {
          ...state,
          answers: newAnswers,
        };
      }

      case 'NEXT_QUESTION':
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex + 1,
        };

      case 'PREVIOUS_QUESTION':
        return {
          ...state,
          currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        };

      case 'COMPLETE_QUIZ': {
        const results = calculateQuizResults(state.answers);
        return {
          ...state,
          results,
          isComplete: true,
        };
      }

      case 'RESET_QUIZ':
        return initialState;

      case 'GOTO_QUESTION':
        return {
          ...state,
          currentQuestionIndex: action.payload,
        };

      default:
        return state;
    }
  }

interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  answerQuestion: (answer: QuizAnswer) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  goToQuestion: (index: number) => void;
  getAnswerForQuestion: (questionId: string) => QuizAnswer | undefined;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const answerQuestion = (answer: QuizAnswer) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: answer });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const previousQuestion = () => {
    dispatch({ type: 'PREVIOUS_QUESTION' });
  };

  const completeQuiz = () => {
    dispatch({ type: 'COMPLETE_QUIZ' });
  };

  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  const goToQuestion = (index: number) => {
    dispatch({ type: 'GOTO_QUESTION', payload: index });
  };

  const getAnswerForQuestion = (questionId: string) => {
    return state.answers.find(a => a.questionId === questionId);
  };

  return (
    <QuizContext.Provider
      value={{
        state,
        dispatch,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        completeQuiz,
        resetQuiz,
        goToQuestion,
        getAnswerForQuestion,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}