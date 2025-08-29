/**
 * Utility functions for managing navigation state and URL parameters
 * Supports bookmarking and direct navigation to quiz results
 */

export interface NavigationState {
  hasResults: boolean;
  showActionButtons: boolean;
  timestamp?: string;
}

const NAVIGATION_STATE_KEY = 'quiz-navigation-state';

/**
 * Save navigation state to sessionStorage for page refresh handling
 */
export function saveNavigationState(state: NavigationState): void {
  try {
    const stateWithTimestamp = {
      ...state,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(stateWithTimestamp));
  } catch (error) {
    console.warn('Failed to save navigation state:', error);
  }
}

/**
 * Load navigation state from sessionStorage
 */
export function loadNavigationState(): NavigationState | null {
  try {
    const stored = sessionStorage.getItem(NAVIGATION_STATE_KEY);
    if (stored) {
      const state = JSON.parse(stored);
      // Check if state is recent (within last hour) to avoid stale state
      if (state.timestamp) {
        const stateTime = new Date(state.timestamp).getTime();
        const now = new Date().getTime();
        const oneHour = 60 * 60 * 1000;

        if (now - stateTime < oneHour) {
          return state;
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load navigation state:', error);
  }
  return null;
}

/**
 * Clear navigation state from sessionStorage
 */
export function clearNavigationState(): void {
  try {
    sessionStorage.removeItem(NAVIGATION_STATE_KEY);
  } catch (error) {
    console.warn('Failed to clear navigation state:', error);
  }
}

/**
 * Check if the current navigation is a direct access to /quiz-results
 * (e.g., from bookmark, direct URL entry, or page refresh)
 */
export function isDirectNavigation(): boolean {
  if (typeof window !== 'undefined') {
    // Use modern Navigation API if available
    if ('navigation' in window && (window as Record<string, unknown>).navigation) {
      const navigation = (window as Record<string, unknown>).navigation as { currentEntry?: { navigationType?: string } };
      const entry = navigation.currentEntry;
      return entry?.navigationType === 'reload' || entry?.navigationType === 'traverse';
    }

    // Fallback to performance.navigation (deprecated but still widely supported)
    if (window.performance?.navigation) {
      const navigationType = (window.performance.navigation as { type?: number }).type;
      const TYPE_RELOAD = 1;
      const TYPE_NAVIGATE = 0;
      return navigationType === TYPE_RELOAD || navigationType === TYPE_NAVIGATE;
    }

    // Final fallback - check if there's a referrer
    return !document.referrer || document.referrer === window.location.href;
  }
  return false;
}

/**
 * Get URL parameters for the current page
 */
export function getUrlParams(): URLSearchParams {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
}

/**
 * Update URL parameters without triggering navigation
 */
export function updateUrlParams(params: Record<string, string>): void {
  if (typeof window !== 'undefined' && window.history) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });

    // Update URL without triggering navigation
    window.history.replaceState(null, '', url.toString());
  }
}

/**
 * Check if the user arrived at /quiz-results from completing a quiz
 */
export function isFromQuizCompletion(): boolean {
  const state = loadNavigationState();
  return state?.hasResults === true && !state?.showActionButtons;
}

/**
 * Mark navigation as coming from quiz completion
 */
export function markQuizCompletionNavigation(): void {
  saveNavigationState({
    hasResults: true,
    showActionButtons: false
  });
}

/**
 * Mark navigation as showing action buttons (no active results)
 */
export function markActionButtonsNavigation(): void {
  saveNavigationState({
    hasResults: false,
    showActionButtons: true
  });
}
