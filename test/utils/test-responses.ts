import type { HTTPError } from '../../src/types';

const isValidErrorCode = (code: number): code is 400 | 401 | 403 | 404 | 409 | 422 | 500 => {
  return [400, 401, 403, 404, 409, 422, 500].includes(code);
};

/**
 * Create a Vikunja API error object
 * @throws If invalid error code is provided
 */
export function createErrorResponse(code: number, message: string): HTTPError {
  if (!isValidErrorCode(code)) {
    throw new Error(`Invalid error status code: ${code}`);
  }

  return {
    code,
    message,
  };
}

type JsonResponseInit = {
  status?: number;
  headers?: Record<string, string>;
};

/**
 * Create a typed JSON response with data
 */
export function createJsonResponse<T>(data: T, init?: JsonResponseInit): Response {
  return new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
}

/**
 * Create a Response with a Vikunja API error
 * Always returns a JSON response with appropriate error status code
 * @throws If invalid error code is provided
 */
export function createErrorJsonResponse(code: number, message: string): Response {
  const error = createErrorResponse(code, message);
  return createJsonResponse(error, { status: code });
}

/**
 * Create an empty response with specified status code
 * Always includes JSON content type for consistency
 */
export function createEmptyResponse(status = 204): Response {
  return new Response(null, {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
