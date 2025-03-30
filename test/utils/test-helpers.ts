import { ApiSuccessResponse, ApiErrorResponse } from '../mocks/types';

interface RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

export const API_BASE = process.env.VIKUNJA_API_BASE || 'http://localhost:3456/api/v1';

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
  const requestHeaders: Record<string, string> = {
    Authorization: 'Bearer test-token',
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: requestHeaders,
  });

  const responseData = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;

  // Handle error responses
  if (!response.ok) {
    const errorResponse = responseData as ApiErrorResponse;
    const errorCode = errorResponse.code ?? response.status;
    throw new ApiError(errorCode, errorResponse.message || 'Unknown error');
  }

  return responseData as ApiSuccessResponse<T>;
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
  promise: Promise<unknown>,
  expectedStatus: number,
  expectedMessage: string
): Promise<void> {
  try {
    await promise;
    expect(true).toBe(false); // Force test failure if promise resolves
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
  projectPath: (id: number | string): string => `/projects/${id}`,
  taskPath: (id: number | string): string => `/tasks/${id}`,
  projectTasksPath: (projectId: number | string): string => `/projects/${projectId}/tasks`,
};
