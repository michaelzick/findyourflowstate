/**
 * Centralized localStorage utility functions for security and consistency
 */

export const STORAGE_KEYS = {
  QUIZ_PROGRESS: 'career-quiz-progress',
  QUIZ_RESULTS: 'career-quiz-results',
  NAVIGATION_STATE: 'quiz-navigation-state',
} as const;

interface StorageData {
  timestamp: string;
  version: string;
  data: unknown;
}

/**
 * Safely check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof localStorage === 'undefined') return false;
    
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Safely get an item from localStorage with validation
 */
export const getStorageItem = <T>(key: string): T | null => {
  try {
    if (!isLocalStorageAvailable()) return null;
    
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item) as StorageData;
    
    // Validate structure
    if (!parsed || typeof parsed !== 'object' || !parsed.timestamp || !parsed.version) {
      removeStorageItem(key); // Clean up invalid data
      return null;
    }
    
    return parsed.data as T;
  } catch (error) {
    console.warn(`Failed to get storage item ${key}:`, error);
    removeStorageItem(key); // Clean up corrupted data
    return null;
  }
};

/**
 * Safely set an item in localStorage
 */
export const setStorageItem = (key: string, data: unknown, version = '1.0.0'): boolean => {
  try {
    if (!isLocalStorageAvailable()) return false;
    
    const storageData: StorageData = {
      timestamp: new Date().toISOString(),
      version,
      data,
    };
    
    localStorage.setItem(key, JSON.stringify(storageData));
    return true;
  } catch (error) {
    console.warn(`Failed to set storage item ${key}:`, error);
    
    // Handle quota exceeded
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      try {
        // Clear old data and retry
        clearOldStorageData();
        localStorage.setItem(key, JSON.stringify({
          timestamp: new Date().toISOString(),
          version,
          data,
        }));
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
};

/**
 * Safely remove an item from localStorage
 */
export const removeStorageItem = (key: string): void => {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn(`Failed to remove storage item ${key}:`, error);
  }
};

/**
 * Clear old storage data to free up space
 */
const clearOldStorageData = (): void => {
  try {
    if (!isLocalStorageAvailable()) return;
    
    const keysToCheck = Object.values(STORAGE_KEYS);
    
    for (const key of keysToCheck) {
      const item = localStorage.getItem(key);
      if (!item) continue;
      
      try {
        const parsed = JSON.parse(item) as StorageData;
        const timestamp = new Date(parsed.timestamp);
        const daysSinceCreated = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60 * 24);
        
        // Remove data older than 30 days
        if (daysSinceCreated > 30) {
          localStorage.removeItem(key);
        }
      } catch {
        // Remove corrupted data
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.warn('Failed to clear old storage data:', error);
  }
};