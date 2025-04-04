import type { HTTPError } from '../../types';

/**
 * Base error class for HTTP client errors
 */
export abstract class VikunjaError extends Error {
  constructor(message: string, code: number) {
    super(message);
    this.name = this.constructor.name;

    // Use Object.defineProperty to ensure code is immutable
    Object.defineProperty(this, 'code', {
      value: code,
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }

  // TypeScript type declaration for the code property
  declare readonly code: number;
}

/**
 * Network-related errors (no connection)
 * These are client-side errors, not from Vikunja API
 */
export class NetworkError extends VikunjaError {
  constructor(message = 'Network error occurred') {
    super(message, 0);
  }
}

/**
 * Request timeout error
 * These are client-side errors, not from Vikunja API
 */
export class TimeoutError extends VikunjaError {
  constructor(message = 'Request timeout') {
    super(message, 408);
  }
}

/**
 * Error for invalid server responses
 * These are client-side errors when response doesn't match expected format
 */
export class InvalidResponseError extends VikunjaError {
  constructor(message = 'Invalid response format') {
    super(message, 400);
  }
}

/**
 * Server errors (500, etc)
 * Represents Vikunja API internal server errors
 */
export class ServerError extends VikunjaError {
  constructor(error: HTTPError) {
    super(error.message || 'Internal server error', error.code ?? 500);
  }
}

/**
 * Validation errors (400)
 * Represents Vikunja API validation errors
 */
export class ValidationError extends VikunjaError {
  constructor(error: HTTPError) {
    super(error.message || 'Validation error', error.code ?? 400);
  }
}

/**
 * Authentication errors (401, 403)
 * Represents Vikunja API auth errors
 */
export class AuthError extends VikunjaError {
  constructor(error: HTTPError) {
    super(error.message || 'Authentication error', error.code ?? 403);
  }
}

/**
 * Not found errors (404)
 * Represents Vikunja API not found errors
 */
export class NotFoundError extends VikunjaError {
  constructor(error: HTTPError) {
    // Check if we have a valid Vikunja error code
    const vikunjaErrorCode = 'code' in error ? error.code : undefined;

    // Use Vikunja error code if it's a valid number, otherwise use 404
    const finalCode = typeof vikunjaErrorCode === 'number' ? vikunjaErrorCode : 404;
    const finalMessage = error.message || 'Resource not found';

    super(finalMessage, finalCode);
  }
}
