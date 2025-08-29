import { QuizAnswer, QuizResults } from '@/types/quiz';

// Validation utilities for edge cases and data integrity

export class ValidationError extends Error {
  constructor(message: string, public field?: string, public value?: unknown) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate quiz answer data
 */
export const validateQuizAnswer = (answer: unknown): answer is QuizAnswer => {
  if (!answer || typeof answer !== 'object') {
    throw new ValidationError('Answer must be an object');
  }

  if (!answer.questionId || typeof answer.questionId !== 'string') {
    throw new ValidationError('Answer must have a valid questionId', 'questionId', answer.questionId);
  }

  if (answer.value === undefined || answer.value === null) {
    throw new ValidationError('Answer must have a value', 'value', answer.value);
  }

  // Validate value types based on common patterns
  const validValueTypes = ['string', 'number', 'boolean'];
  if (!validValueTypes.includes(typeof answer.value)) {
    throw new ValidationError('Answer value must be string, number, or boolean', 'value', typeof answer.value);
  }

  return true;
};

/**
 * Validate array of quiz answers
 */
export const validateQuizAnswers = (answers: unknown[]): answers is QuizAnswer[] => {
  if (!Array.isArray(answers)) {
    throw new ValidationError('Answers must be an array');
  }

  answers.forEach((answer, index) => {
    try {
      validateQuizAnswer(answer);
    } catch (error) {
      throw new ValidationError(
        `Invalid answer at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        `answers[${index}]`,
        answer
      );
    }
  });

  // Check for duplicate question IDs
  const questionIds = answers.map(a => a.questionId);
  const duplicates = questionIds.filter((id, index) => questionIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    throw new ValidationError(
      `Duplicate question IDs found: ${duplicates.join(', ')}`,
      'questionIds',
      duplicates
    );
  }

  return true;
};

/**
 * Validate career path data
 */
export const validateCareerPath = (path: unknown) => {
  if (!path || typeof path !== 'object') {
    throw new ValidationError('Career path must be an object');
  }

  if (!path.name || typeof path.name !== 'string') {
    throw new ValidationError('Career path must have a valid name', 'name', path.name);
  }

  if (typeof path.score !== 'number' || path.score < 0 || path.score > 100) {
    throw new ValidationError('Career path score must be a number between 0 and 100', 'score', path.score);
  }

  if (!path.description || typeof path.description !== 'string') {
    throw new ValidationError('Career path must have a valid description', 'description', path.description);
  }

  return true;
};

/**
 * Validate complete quiz results
 */
export const validateCompleteQuizResults = (results: unknown): results is QuizResults => {
  if (!results || typeof results !== 'object') {
    throw new ValidationError('Quiz results must be an object');
  }

  // Validate career paths
  if (!Array.isArray(results.careerPaths)) {
    throw new ValidationError('Quiz results must have careerPaths array', 'careerPaths', results.careerPaths);
  }

  if (results.careerPaths.length === 0) {
    throw new ValidationError('Quiz results must have at least one career path', 'careerPaths', results.careerPaths);
  }

  results.careerPaths.forEach((path: unknown, index: number) => {
    try {
      validateCareerPath(path);
    } catch (error) {
      throw new ValidationError(
        `Invalid career path at index ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        `careerPaths[${index}]`,
        path
      );
    }
  });

  // Validate personality insight
  if (!results.personalityInsight || typeof results.personalityInsight !== 'object') {
    throw new ValidationError('Quiz results must have personalityInsight object', 'personalityInsight', results.personalityInsight);
  }

  // Validate confidence
  if (typeof results.confidence !== 'number' || results.confidence < 0 || results.confidence > 100) {
    throw new ValidationError('Quiz results confidence must be a number between 0 and 100', 'confidence', results.confidence);
  }

  // Validate completedAt
  const completedAt = new Date(results.completedAt);
  if (isNaN(completedAt.getTime())) {
    throw new ValidationError('Quiz results must have a valid completedAt date', 'completedAt', results.completedAt);
  }

  // Validate completedAt is not in the future (with 5 minute tolerance for clock skew)
  const now = new Date();
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
  if (completedAt > fiveMinutesFromNow) {
    throw new ValidationError('Quiz results completedAt cannot be in the future', 'completedAt', results.completedAt);
  }

  // Validate AI analysis if present
  if (results.aiAnalysis) {
    if (typeof results.aiAnalysis !== 'object') {
      throw new ValidationError('AI analysis must be an object', 'aiAnalysis', results.aiAnalysis);
    }

    // Validate specific occupations if present
    if (results.aiAnalysis.specificOccupations) {
      if (!Array.isArray(results.aiAnalysis.specificOccupations)) {
        throw new ValidationError('AI analysis specificOccupations must be an array', 'aiAnalysis.specificOccupations', results.aiAnalysis.specificOccupations);
      }

      results.aiAnalysis.specificOccupations.forEach((occupation: unknown, index: number) => {
        if (!occupation || typeof occupation !== 'object') {
          throw new ValidationError(
            `AI analysis specific occupation at index ${index} must be an object`,
            `aiAnalysis.specificOccupations[${index}]`,
            occupation
          );
        }

        if (!occupation.title || typeof occupation.title !== 'string') {
          throw new ValidationError(
            `AI analysis specific occupation at index ${index} must have a valid title`,
            `aiAnalysis.specificOccupations[${index}].title`,
            occupation.title
          );
        }
      });
    }
  }

  return true;
};

/**
 * Safe validation wrapper that returns boolean instead of throwing
 */
export const safeValidate = <T>(
  validator: (data: unknown) => data is T,
  data: unknown
): { isValid: boolean; error: ValidationError | null; data: T | null } => {
  try {
    const isValid = validator(data);
    return { isValid, error: null, data: isValid ? data : null };
  } catch (error) {
    const validationError = error instanceof ValidationError
      ? error
      : new ValidationError(error instanceof Error ? error.message : 'Unknown validation error');

    return { isValid: false, error: validationError, data: null };
  }
};

/**
 * Sanitize user input to prevent XSS and other issues
 */
export const sanitizeString = (input: unknown): string => {
  if (typeof input !== 'string') {
    return String(input || '');
  }

  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate and sanitize quiz answer before processing
 */
export const sanitizeQuizAnswer = (answer: unknown): QuizAnswer => {
  const validation = safeValidate(validateQuizAnswer, answer);

  if (!validation.isValid || !validation.data) {
    throw validation.error || new ValidationError('Invalid quiz answer');
  }

  // Sanitize string values
  const sanitizedAnswer: QuizAnswer = {
    ...validation.data,
    questionId: sanitizeString(validation.data.questionId),
  };

  // Sanitize value if it's a string
  if (typeof validation.data.value === 'string') {
    sanitizedAnswer.value = sanitizeString(validation.data.value);
  }

  return sanitizedAnswer;
};
