import { ApiSuccessResponse, ApiErrorResponse } from '../mocks/types';

const API_BASE = process.env.VIKUNJA_API_BASE || 'http://localhost:3456/api/v1';

/**
 * Custom API Error class for better error handling
 */
export class ApiError extends Error {
  constructor(
    public code: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Typed fetch wrapper for API calls
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiSuccessResponse<T>> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  // Handle error responses
  if (!response.ok) {
    const error = data as ApiErrorResponse;
    // Default to response status if error code is not provided
    const errorCode = typeof error.code === 'number' ? error.code : response.status;
    throw new ApiError(errorCode, error.message || 'Unknown error');
  }

  return data as ApiSuccessResponse<T>;
}

/**
 * Helper to make typed PUT requests
 */
export async function apiPut<T>(path: string, data: unknown): Promise<ApiSuccessResponse<T>> {
  return apiFetch<T>(path, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Helper to make typed POST requests
 */
export async function apiPost<T>(path: string, data: unknown): Promise<ApiSuccessResponse<T>> {
  return apiFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Helper to assert API error responses
 */
export async function expectApiError(
  promise: Promise<any>,
  expectedStatus: number,
  expectedMessage: string
): Promise<void> {
  try {
    await promise;
    fail('Expected API call to fail');
  } catch (error) {
    if (error instanceof ApiError) {
      expect(error.code).toBe(expectedStatus);
      expect(error.message).toBe(expectedMessage);
    } else {
      throw error;
    }
  }
}

/**
 * Common test data builder functions
 */
export const testData = {
  projectPath: (id: number | string) => `/projects/${id}`,
  taskPath: (id: number | string) => `/tasks/${id}`,
  projectTasksPath: (projectId: number | string) => `/projects/${projectId}/tasks`,
};

// Export API base for use in tests
export { API_BASE };
