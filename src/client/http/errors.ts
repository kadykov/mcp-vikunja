import type { HTTPError } from '../../types';

/**
 * Base error class for HTTP client errors
 */
export class VikunjaError extends Error {
  readonly code: number;

  constructor(message: string, code = 500) {
    super(message);
    this.name = 'VikunjaError';
    this.code = code;
  }
}

/**
 * Network-related errors (no connection)
 * These are client-side errors, not from Vikunja API
 */
export class NetworkError extends VikunjaError {
  constructor(message = 'Network error occurred') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

/**
 * Request timeout error
 * These are client-side errors, not from Vikunja API
 */
export class TimeoutError extends VikunjaError {
  constructor(message = 'Request timeout') {
    super(message, 408);
    this.name = 'TimeoutError';
  }
}

/**
 * Error for invalid server responses
 * These are client-side errors when response doesn't match expected format
 */
export class InvalidResponseError extends VikunjaError {
  constructor(message = 'Invalid response format') {
    super(message, 400);
    this.name = 'InvalidResponseError';
  }
}

/**
 * Server errors (500, etc)
 * Represents Vikunja API internal server errors
 */
export class ServerError extends VikunjaError {
  constructor(error: HTTPError) {
    super(error.message || 'Internal server error', error.code);
    this.name = 'ServerError';
  }
}

/**
 * Validation errors (400)
 * Represents Vikunja API validation errors
 */
export class ValidationError extends VikunjaError {
  constructor(error: HTTPError) {
    super(error.message || 'Validation error', error.code);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication errors (401, 403)
 * Represents Vikunja API auth errors
 */
export class AuthError extends VikunjaError {
  constructor(error: HTTPError) {
    super(error.message || 'Authentication error', error.code);
    this.name = 'AuthError';
  }
}

/**
 * Not found errors (404)
 * Represents Vikunja API not found errors
 */
export class NotFoundError extends VikunjaError {
  constructor(error: HTTPError) {
    super(error.message || 'Resource not found', error.code);
    this.name = 'NotFoundError';
  }
}
