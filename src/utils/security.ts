/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitize a string to prevent XSS attacks
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Validate that a value is a safe string (no script tags or suspicious content)
 */
export const isSafeString = (value: string): boolean => {
  if (typeof value !== 'string') return false;

  // Check for potentially dangerous patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // event handlers like onclick=
    /data:text\/html/i,
    /vbscript:/i,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(value));
};

/**
 * Validate JSON input to prevent prototype pollution
 */
export const isSafeJSON = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);

    // Check for prototype pollution attempts
    if (hasProtoProperty(parsed)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Recursively check for dangerous __proto__ or constructor properties
 */
const hasProtoProperty = (obj: unknown): boolean => {
  if (obj === null || typeof obj !== 'object') return false;

  const objectToCheck = obj as Record<string, unknown>;

  // Only check for own properties, not inherited ones
  if (Object.prototype.hasOwnProperty.call(objectToCheck, '__proto__') ||
      Object.prototype.hasOwnProperty.call(objectToCheck, 'constructor') ||
      Object.prototype.hasOwnProperty.call(objectToCheck, 'prototype')) {
    return true;
  }

  // Recursively check nested objects
  for (const value of Object.values(objectToCheck)) {
    if (hasProtoProperty(value)) {
      return true;
    }
  }

  return false;
};

/**
 * Safely parse JSON with validation
 */
export const safeJSONParse = <T>(jsonString: string): T | null => {
  try {
    if (!isSafeJSON(jsonString)) {
      console.warn('Potentially unsafe JSON detected');
      return null;
    }

    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return null;
  }
};
