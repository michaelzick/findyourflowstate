import { useCallback } from 'react';

type LogLevel = 'log' | 'warn' | 'error' | 'info';

interface LoggerOptions {
  enableInProduction?: boolean;
  prefix?: string;
}

/**
 * Custom hook for consistent and controllable console logging
 */
export const useConsoleLogger = (options: LoggerOptions = {}) => {
  const { enableInProduction = false, prefix = '' } = options;
  
  const isProduction = process.env.NODE_ENV === 'production';
  const shouldLog = !isProduction || enableInProduction;

  const createLogger = useCallback((level: LogLevel) => {
    return (...args: unknown[]) => {
      if (!shouldLog) return;
      
      const prefixedArgs = prefix ? [`[${prefix}]`, ...args] : args;
      console[level](...prefixedArgs);
    };
  }, [shouldLog, prefix]);

  return {
    log: createLogger('log'),
    warn: createLogger('warn'),
    error: createLogger('error'),
    info: createLogger('info'),
  };
};