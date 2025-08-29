import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseBrowserNavigationOptions {
  onNavigateAway?: () => void;
  onNavigateBack?: () => void;
  preventUnload?: boolean;
}

/**
 * Custom hook to handle browser navigation events for the quiz results page
 * Provides enhanced browser integration including back/forward button handling
 */
export function useBrowserNavigation(options: UseBrowserNavigationOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { onNavigateAway, onNavigateBack, preventUnload = false } = options;

  // Handle browser back/forward button events
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // This event fires when user uses browser back/forward buttons
      console.log('Browser navigation detected:', {
        pathname: location.pathname,
        state: event.state
      });

      if (onNavigateBack) {
        onNavigateBack();
      }
    };

    // Add event listener for browser navigation
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, onNavigateBack]);

  // Handle page unload/refresh events
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (preventUnload) {
        // Prevent accidental page refresh/close
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
    };

    if (preventUnload) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      if (preventUnload) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    };
  }, [preventUnload]);

  // Handle route changes within the app
  useEffect(() => {
    if (onNavigateAway && location.pathname !== '/quiz-results') {
      onNavigateAway();
    }
  }, [location.pathname, onNavigateAway]);

  // Utility function to navigate with proper history management
  const navigateWithHistory = useCallback((to: string, options?: { replace?: boolean; state?: unknown }) => {
    navigate(to, {
      replace: options?.replace || false,
      state: options?.state
    });
  }, [navigate]);

  // Utility function to handle browser back navigation programmatically
  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  // Utility function to handle browser forward navigation programmatically
  const goForward = useCallback(() => {
    window.history.forward();
  }, []);

  return {
    navigateWithHistory,
    goBack,
    goForward,
    currentPath: location.pathname,
    locationState: location.state
  };
}
