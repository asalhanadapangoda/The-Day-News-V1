/**
 * Simple logger utility to replace console.log statements
 * In production, this can be extended to use winston or pino
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  info: (...args) => {
    if (isDevelopment) {
      console.log('[INFO]', ...args);
    }
  },

  error: (...args) => {
    console.error('[ERROR]', ...args);
  },

  warn: (...args) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  },

  debug: (...args) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },
};

export default logger;

