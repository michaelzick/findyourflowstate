import { QuizResults } from '../types/quiz';

// Storage key for quiz results (separate from quiz progress)
const QUIZ_RESULTS_STORAGE_KEY = 'career-quiz-results';

// Current version for data compatibility
const STORAGE_VERSION = '1.0.0';
const QUIZ_VERSION = '1.0.0'; // Can be updated when quiz structure changes

// Interface for stored quiz results with metadata
interface StoredQuizResults {
  results: QuizResults;
  timestamp: string;
  version: string;
  quizVersion: string;
}

// Error types for better error handling
export enum StorageError {
  UNAVAILABLE = 'STORAGE_UNAVAILABLE',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  CORRUPTED_DATA = 'CORRUPTED_DATA',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED'
}

export class QuizResultsStorageError extends Error {
  constructor(public type: StorageError, message: string, public originalError?: Error) {
    super(message);
    this.name = 'QuizResultsStorageError';
  }

  // Helper method to get user-friendly error messages
  getUserFriendlyMessage(): string {
    switch (this.type) {
      case StorageError.UNAVAILABLE:
        return 'Your browser storage is not available. Please enable cookies and local storage.';
      case StorageError.QUOTA_EXCEEDED:
        return 'Your browser storage is full. Please clear some data and try again.';
      case StorageError.CORRUPTED_DATA:
        return 'Your saved quiz data appears to be corrupted. We\'ll start fresh.';
      case StorageError.VALIDATION_FAILED:
        return 'The quiz results data is invalid. Please retake the quiz.';
      case StorageError.PARSE_ERROR:
        return 'Unable to read your saved quiz data. We\'ll start fresh.';
      case StorageError.PERMISSION_DENIED:
        return 'Permission denied to access browser storage. Please check your browser settings.';
      case StorageError.NETWORK_ERROR:
        return 'Network error occurred while saving your data. Please try again.';
      default:
        return 'An unexpected error occurred with your quiz data. Please try again.';
    }
  }

  // Helper method to determine if error is recoverable
  isRecoverable(): boolean {
    return [
      StorageError.NETWORK_ERROR,
      StorageError.UNKNOWN_ERROR
    ].includes(this.type);
  }
}

/**
 * Check if localStorage is available and functional
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    // Check if localStorage exists
    if (typeof localStorage === 'undefined') {
      return false;
    }

    // Test write/read/delete operations
    const testKey = '__quiz_storage_test__';
    const testValue = 'test_value_' + Date.now();

    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);

    return retrieved === testValue;
  } catch (error) {
    console.warn('localStorage availability check failed:', error);
    return false;
  }
};

/**
 * Validate that quiz results data is complete and valid
 */
const validateQuizResults = (results: any): results is QuizResults => {
  try {
    if (!results || typeof results !== 'object') {
      console.warn('Quiz results validation failed: not an object');
      return false;
    }

    // Check required properties
    const requiredProps = ['careerPaths', 'personalityInsight', 'confidence', 'completedAt'];
    for (const prop of requiredProps) {
      if (!(prop in results)) {
        console.warn(`Quiz results validation failed: missing property ${prop}`);
        return false;
      }
    }

    // Validate careerPaths array
    if (!Array.isArray(results.careerPaths)) {
      console.warn('Quiz results validation failed: careerPaths is not an array');
      return false;
    }

    if (results.careerPaths.length === 0) {
      console.warn('Quiz results validation failed: careerPaths array is empty');
      return false;
    }

    // Validate each career path has required properties
    for (let i = 0; i < results.careerPaths.length; i++) {
      const path = results.careerPaths[i];
      if (!path || typeof path !== 'object') {
        console.warn(`Quiz results validation failed: careerPaths[${i}] is not an object`);
        return false;
      }

      const requiredPathProps = ['name', 'score', 'description'];
      for (const pathProp of requiredPathProps) {
        if (!(pathProp in path)) {
          console.warn(`Quiz results validation failed: careerPaths[${i}] missing ${pathProp}`);
          return false;
        }
      }

      // Validate score is a number
      if (typeof path.score !== 'number' || path.score < 0 || path.score > 100) {
        console.warn(`Quiz results validation failed: careerPaths[${i}] has invalid score`);
        return false;
      }
    }

    // Validate personalityInsight object
    if (!results.personalityInsight || typeof results.personalityInsight !== 'object') {
      console.warn('Quiz results validation failed: personalityInsight is not an object');
      return false;
    }

    // Validate confidence is a number
    if (typeof results.confidence !== 'number' || results.confidence < 0 || results.confidence > 100) {
      console.warn('Quiz results validation failed: confidence is not a valid number');
      return false;
    }

    // Validate completedAt is a valid date
    const completedAt = new Date(results.completedAt);
    if (isNaN(completedAt.getTime())) {
      console.warn('Quiz results validation failed: completedAt is not a valid date');
      return false;
    }

    // Validate completedAt is not in the future (with 1 minute tolerance)
    const now = new Date();
    const oneMinuteFromNow = new Date(now.getTime() + 60000);
    if (completedAt > oneMinuteFromNow) {
      console.warn('Quiz results validation failed: completedAt is in the future');
      return false;
    }

    // Optional: Validate AI analysis if present
    if (results.aiAnalysis) {
      if (typeof results.aiAnalysis !== 'object') {
        console.warn('Quiz results validation failed: aiAnalysis is not an object');
        return false;
      }

      // Validate specific occupations if present
      if (results.aiAnalysis.specificOccupations && !Array.isArray(results.aiAnalysis.specificOccupations)) {
        console.warn('Quiz results validation failed: aiAnalysis.specificOccupations is not an array');
        return false;
      }
    }

    return true;
  } catch (error) {
    console.warn('Quiz results validation failed with error:', error);
    return false;
  }
};

/**
 * Validate stored data structure and version compatibility
 */
const validateStoredData = (data: any): data is StoredQuizResults => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check required metadata
  if (!data.timestamp || !data.version || !data.quizVersion || !data.results) {
    return false;
  }

  // Validate timestamp
  const timestamp = new Date(data.timestamp);
  if (isNaN(timestamp.getTime())) {
    return false;
  }

  // Validate version format (basic semver check)
  const versionRegex = /^\d+\.\d+\.\d+$/;
  if (!versionRegex.test(data.version) || !versionRegex.test(data.quizVersion)) {
    return false;
  }

  // Validate the actual results data
  return validateQuizResults(data.results);
};

/**
 * Save quiz results to localStorage with metadata and error handling
 */
export const saveQuizResults = (results: QuizResults): void => {
  if (!isLocalStorageAvailable()) {
    throw new QuizResultsStorageError(
      StorageError.UNAVAILABLE,
      'localStorage is not available in this browser'
    );
  }

  if (!validateQuizResults(results)) {
    throw new QuizResultsStorageError(
      StorageError.VALIDATION_FAILED,
      'Quiz results data is invalid or incomplete'
    );
  }

  const storedData: StoredQuizResults = {
    results,
    timestamp: new Date().toISOString(),
    version: STORAGE_VERSION,
    quizVersion: QUIZ_VERSION
  };

  try {
    const serializedData = JSON.stringify(storedData);
    localStorage.setItem(QUIZ_RESULTS_STORAGE_KEY, serializedData);
  } catch (error) {
    if (error instanceof Error) {
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        // Try to clear old data and retry
        try {
          clearQuizResults();
          const serializedData = JSON.stringify(storedData);
          localStorage.setItem(QUIZ_RESULTS_STORAGE_KEY, serializedData);
        } catch (retryError) {
          throw new QuizResultsStorageError(
            StorageError.QUOTA_EXCEEDED,
            'localStorage quota exceeded and cleanup failed',
            retryError instanceof Error ? retryError : undefined
          );
        }
      } else {
        throw new QuizResultsStorageError(
          StorageError.UNKNOWN_ERROR,
          `Failed to save quiz results: ${error.message}`,
          error
        );
      }
    } else {
      throw new QuizResultsStorageError(
        StorageError.UNKNOWN_ERROR,
        'Failed to save quiz results: Unknown error'
      );
    }
  }
};

/**
 * Load quiz results from localStorage with validation
 */
export const loadQuizResults = (): QuizResults | null => {
  if (!isLocalStorageAvailable()) {
    throw new QuizResultsStorageError(
      StorageError.UNAVAILABLE,
      'localStorage is not available in this browser'
    );
  }

  try {
    const stored = localStorage.getItem(QUIZ_RESULTS_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(stored);
    } catch (parseError) {
      console.warn('Failed to parse stored quiz results:', parseError);
      // Clear corrupted data and throw error
      try {
        clearQuizResults();
      } catch (clearError) {
        console.warn('Failed to clear corrupted quiz results:', clearError);
      }
      throw new QuizResultsStorageError(
        StorageError.PARSE_ERROR,
        'Stored quiz results data is corrupted and cannot be parsed',
        parseError instanceof Error ? parseError : undefined
      );
    }

    if (!validateStoredData(parsedData)) {
      console.warn('Stored quiz results data is invalid or corrupted');
      // Clear corrupted data and throw error
      try {
        clearQuizResults();
      } catch (clearError) {
        console.warn('Failed to clear corrupted quiz results:', clearError);
      }
      throw new QuizResultsStorageError(
        StorageError.CORRUPTED_DATA,
        'Stored quiz results data is invalid or corrupted'
      );
    }

    // Convert completedAt back to Date object
    const results = {
      ...parsedData.results,
      completedAt: new Date(parsedData.results.completedAt)
    };

    // Final validation of the converted results
    if (!validateQuizResults(results)) {
      throw new QuizResultsStorageError(
        StorageError.VALIDATION_FAILED,
        'Quiz results failed final validation after loading'
      );
    }

    return results;
  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof QuizResultsStorageError) {
      throw error;
    }

    // Handle unexpected errors
    console.error('Unexpected error loading quiz results:', error);
    throw new QuizResultsStorageError(
      StorageError.UNKNOWN_ERROR,
      `Unexpected error loading quiz results: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    );
  }
};

/**
 * Check if valid quiz results exist in localStorage
 */
export const hasStoredQuizResults = (): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const stored = localStorage.getItem(QUIZ_RESULTS_STORAGE_KEY);
    if (!stored) {
      return false;
    }

    const parsedData = JSON.parse(stored);
    return validateStoredData(parsedData);
  } catch {
    return false;
  }
};

/**
 * Clear quiz results from localStorage
 */
export const clearQuizResults = (): void => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, cannot clear quiz results');
    return;
  }

  try {
    localStorage.removeItem(QUIZ_RESULTS_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear quiz results from localStorage:', error);
    throw new QuizResultsStorageError(
      StorageError.UNKNOWN_ERROR,
      `Failed to clear quiz results: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    );
  }
};

/**
 * Get metadata about stored quiz results without loading the full data
 */
export const getStoredResultsMetadata = (): { timestamp: Date; version: string; quizVersion: string } | null => {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const stored = localStorage.getItem(QUIZ_RESULTS_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsedData = JSON.parse(stored);

    if (!validateStoredData(parsedData)) {
      return null;
    }

    return {
      timestamp: new Date(parsedData.timestamp),
      version: parsedData.version,
      quizVersion: parsedData.quizVersion
    };
  } catch {
    return null;
  }
};

/**
 * Safe wrapper for loading quiz results that handles errors gracefully
 */
export const safeLoadQuizResults = (): {
  results: QuizResults | null;
  error: QuizResultsStorageError | null;
} => {
  try {
    const results = loadQuizResults();
    return { results, error: null };
  } catch (error) {
    if (error instanceof QuizResultsStorageError) {
      return { results: null, error };
    }

    // Convert unexpected errors to our error type
    const storageError = new QuizResultsStorageError(
      StorageError.UNKNOWN_ERROR,
      error instanceof Error ? error.message : 'Unknown error occurred',
      error instanceof Error ? error : undefined
    );

    return { results: null, error: storageError };
  }
};

/**
 * Safe wrapper for saving quiz results that handles errors gracefully
 */
export const safeSaveQuizResults = (results: QuizResults): {
  success: boolean;
  error: QuizResultsStorageError | null;
} => {
  try {
    saveQuizResults(results);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof QuizResultsStorageError) {
      return { success: false, error };
    }

    // Convert unexpected errors to our error type
    const storageError = new QuizResultsStorageError(
      StorageError.UNKNOWN_ERROR,
      error instanceof Error ? error.message : 'Unknown error occurred',
      error instanceof Error ? error : undefined
    );

    return { success: false, error: storageError };
  }
};

/**
 * Get storage health information for debugging
 */
export const getStorageHealth = (): {
  isAvailable: boolean;
  hasResults: boolean;
  resultsValid: boolean;
  metadata: { timestamp: Date; version: string; quizVersion: string } | null;
  errors: string[];
} => {
  const errors: string[] = [];
  let isAvailable = false;
  let hasResults = false;
  let resultsValid = false;
  let metadata = null;

  // Check availability
  try {
    isAvailable = isLocalStorageAvailable();
    if (!isAvailable) {
      errors.push('localStorage is not available');
    }
  } catch (error) {
    errors.push(`localStorage availability check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  if (isAvailable) {
    // Check if results exist
    try {
      const stored = localStorage.getItem(QUIZ_RESULTS_STORAGE_KEY);
      hasResults = !!stored;

      if (hasResults) {
        // Try to parse and validate
        try {
          const parsedData = JSON.parse(stored!);
          resultsValid = validateStoredData(parsedData);

          if (resultsValid) {
            metadata = {
              timestamp: new Date(parsedData.timestamp),
              version: parsedData.version,
              quizVersion: parsedData.quizVersion
            };
          } else {
            errors.push('Stored results data is invalid');
          }
        } catch (parseError) {
          errors.push(`Failed to parse stored results: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      errors.push(`Failed to check stored results: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return {
    isAvailable,
    hasResults,
    resultsValid,
    metadata,
    errors
  };
};

/**
 * Attempt to repair corrupted storage by clearing invalid data
 */
export const repairStorage = (): {
  success: boolean;
  actions: string[];
  errors: string[];
} => {
  const actions: string[] = [];
  const errors: string[] = [];

  try {
    const health = getStorageHealth();

    if (!health.isAvailable) {
      errors.push('Cannot repair storage: localStorage is not available');
      return { success: false, actions, errors };
    }

    if (health.hasResults && !health.resultsValid) {
      try {
        clearQuizResults();
        actions.push('Cleared corrupted quiz results data');
      } catch (clearError) {
        errors.push(`Failed to clear corrupted data: ${clearError instanceof Error ? clearError.message : 'Unknown error'}`);
      }
    }

    // Try to clear any other potentially corrupted quiz-related data
    try {
      const keysToCheck = ['career-quiz-progress', 'quiz-navigation-state'];
      for (const key of keysToCheck) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            JSON.parse(value); // Test if it's valid JSON
          }
        } catch (parseError) {
          localStorage.removeItem(key);
          actions.push(`Cleared corrupted data for key: ${key}`);
        }
      }
    } catch (error) {
      errors.push(`Error during storage cleanup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      success: errors.length === 0,
      actions,
      errors
    };
  } catch (error) {
    errors.push(`Storage repair failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, actions, errors };
  }
};
