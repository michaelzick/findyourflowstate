import { QuizResultsStorageError, StorageError } from './quiz-results-storage';

// Global error handler for unhandled promise rejections and errors
export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorCallbacks: Array<(error: Error) => void> = [];

  private constructor() {
    this.setupGlobalHandlers();
  }

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  private setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);

      // Convert to Error if it's not already
      const error = event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));

      this.handleError(error);

      // Prevent the default browser behavior (logging to console)
      event.preventDefault();
    });

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      console.error('Uncaught error:', event.error);
      this.handleError(event.error || new Error(event.message));
    });
  }

  private handleError(error: Error) {
    // Log error details
    console.group('🚨 Global Error Handler');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    console.error('Type:', error.constructor.name);
    console.groupEnd();

    // Call registered callbacks
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError);
      }
    });

    // Handle specific error types
    if (error instanceof QuizResultsStorageError) {
      this.handleStorageError(error);
    }
  }

  private handleStorageError(error: QuizResultsStorageError) {
    // Log storage-specific error details
    console.group('💾 Storage Error Details');
    console.error('Storage Error Type:', error.type);
    console.error('User Message:', error.getUserFriendlyMessage());
    console.error('Is Recoverable:', error.isRecoverable());
    if (error.originalError) {
      console.error('Original Error:', error.originalError);
    }
    console.groupEnd();

    // Could integrate with error reporting service here
    // Example: Sentry.captureException(error);
  }

  // Register a callback to be called when errors occur
  onError(callback: (error: Error) => void) {
    this.errorCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) {
        this.errorCallbacks.splice(index, 1);
      }
    };
  }

  // Manually report an error
  reportError(error: Error, context?: string) {
    if (context) {
      console.error(`Error in ${context}:`, error);
    }
    this.handleError(error);
  }
}

// Initialize the global error handler
export const globalErrorHandler = GlobalErrorHandler.getInstance();

// Utility function to safely execute async operations with error handling
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  context?: string
): Promise<{ result: T | null; error: Error | null }> => {
  try {
    const result = await operation();
    return { result, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));

    if (context) {
      globalErrorHandler.reportError(errorObj, context);
    } else {
      globalErrorHandler.reportError(errorObj);
    }

    return { result: null, error: errorObj };
  }
};

// Utility function to safely execute synchronous operations with error handling
export const safeSync = <T>(
  operation: () => T,
  context?: string
): { result: T | null; error: Error | null } => {
  try {
    const result = operation();
    return { result, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));

    if (context) {
      globalErrorHandler.reportError(errorObj, context);
    } else {
      globalErrorHandler.reportError(errorObj);
    }

    return { result: null, error: errorObj };
  }
};
