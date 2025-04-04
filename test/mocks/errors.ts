import type { HTTPError } from '../../src/types';

export interface VikunjaErrorResponse extends HTTPError {
  code: number; // Vikunja's error code (e.g. 3001)
  message: string; // Human readable error message
}

/**
 * Creates a Vikunja error response for testing
 *
 * @param code - The Vikunja error code (e.g. 3001)
 * @param message - The error message
 * @param httpStatus - The HTTP status code
 * @returns A Response object with the Vikunja error format
 */
export function createVikunjaErrorResponse(
  code: number,
  message: string,
  httpStatus: number
): Response {
  return new Response(JSON.stringify({ code, message }, null, 2), {
    status: httpStatus,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
