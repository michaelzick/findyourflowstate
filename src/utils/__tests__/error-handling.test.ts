import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  QuizResultsStorageError,
  StorageError,
  safeLoadQuizResults,
  safeSaveQuizResults,
  getStorageHealth,
  repairStorage
} from '../quiz-results-storage';
import { ValidationError, safeValidate, validateQuizAnswer } from '../validation';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('QuizResultsStorageError', () => {
    it('should create error with correct properties', () => {
      const error = new QuizResultsStorageError(
        StorageError.CORRUPTED_DATA,
        'Test error message'
      );

      expect(error.type).toBe(StorageError.CORRUPTED_DATA);
      expect(error.message).toBe('Test error message');
      expect(error.name).toBe('QuizResultsStorageError');
    });

    it('should provide user-friendly messages', () => {
      const error = new QuizResultsStorageError(
        StorageError.UNAVAILABLE,
        'Technical message'
      );

      expect(error.getUserFriendlyMessage()).toContain('browser storage is not available');
    });

    it('should identify recoverable errors', () => {
      const recoverableError = new QuizResultsStorageError(
        StorageError.NETWORK_ERROR,
        'Network error'
      );
      const nonRecoverableError = new QuizResultsStorageError(
        StorageError.UNAVAILABLE,
        'Storage unavailable'
      );

      expect(recoverableError.isRecoverable()).toBe(true);
      expect(nonRecoverableError.isRecoverable()).toBe(false);
    });
  });

  describe('Safe Storage Operations', () => {
    it('should handle localStorage unavailable gracefully', () => {
      // Mock localStorage as unavailable
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage is not available');
      });

      const { results, error } = safeLoadQuizResults();

      expect(results).toBeNull();
      expect(error).toBeInstanceOf(QuizResultsStorageError);
      expect(error?.type).toBe(StorageError.UNAVAILABLE);
    });

    it('should handle corrupted data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      const { results, error } = safeLoadQuizResults();

      expect(results).toBeNull();
      expect(error).toBeInstanceOf(QuizResultsStorageError);
      expect(error?.type).toBe(StorageError.PARSE_ERROR);
    });
  });

  describe('Storage Health Check', () => {
    it('should report storage health correctly', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const health = getStorageHealth();

      expect(health).toHaveProperty('isAvailable');
      expect(health).toHaveProperty('hasResults');
      expect(health).toHaveProperty('resultsValid');
      expect(health).toHaveProperty('errors');
    });
  });

  describe('Validation', () => {
    it('should validate quiz answers correctly', () => {
      const validAnswer = {
        questionId: 'q1',
        value: 'test answer'
      };

      expect(() => validateQuizAnswer(validAnswer)).not.toThrow();
    });

    it('should throw ValidationError for invalid answers', () => {
      const invalidAnswer = {
        questionId: '',
        value: null
      };

      expect(() => validateQuizAnswer(invalidAnswer)).toThrow(ValidationError);
    });

    it('should provide safe validation wrapper', () => {
      const validData = { questionId: 'q1', value: 'test' };
      const invalidData = { questionId: '', value: null };

      const validResult = safeValidate(validateQuizAnswer, validData);
      const invalidResult = safeValidate(validateQuizAnswer, invalidData);

      expect(validResult.isValid).toBe(true);
      expect(validResult.error).toBeNull();

      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toBeInstanceOf(ValidationError);
    });
  });
});
