import { it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QuizProvider } from '@/contexts/QuizContext';
import QuizResultsPage from '@/pages/QuizResultsPage';
import { safeLoadQuizResults, safeSaveQuizResults } from '@/utils/quiz-results-storage';
import { mockQuizResults } from './mocks/quiz-data';

it('settles on an empty results deep link and opens the no-results dialog', async () => {
  render(<MemoryRouter initialEntries={['/quiz-results']}><QuizProvider><QuizResultsPage /></QuizProvider></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Load your previous quiz results' }));
  expect(await screen.findByRole('alertdialog', { name: 'No Previous Results Found' }, { timeout: 2000 })).toBeInTheDocument();
});

it('preserves stored career recommendations through serialization', () => {
  expect(safeSaveQuizResults(mockQuizResults).success).toBe(true);
  const loaded = safeLoadQuizResults();
  expect(loaded.error).toBeNull();
  expect(loaded.results?.careerPaths.map(path => [path.id, path.score])).toEqual(mockQuizResults.careerPaths.map(path => [path.id, path.score]));
  expect(loaded.results?.personalityInsight).toEqual(mockQuizResults.personalityInsight);
});
