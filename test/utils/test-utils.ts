import type { VikunjaProject } from '../../src/types';
import { createJsonResponse, createErrorJsonResponse } from './test-responses';

/**
 * Success response for a project endpoint
 */
export function createProjectResponse(project: VikunjaProject): Response {
  return createJsonResponse(project);
}

/**
 * Success response for a project list endpoint
 */
export function createProjectListResponse(projects: VikunjaProject[]): Response {
  return createJsonResponse(projects);
}

/**
 * Project error type constants
 */
export const PROJECT_ERROR = {
  not_found: {
    code: 404,
    message: 'Project not found',
  },
  invalid_input: {
    code: 400,
    message: 'Title is required',
  },
} as const;

type ProjectErrorType = keyof typeof PROJECT_ERROR;

/**
 * Error response for a project endpoint with type-safe error codes
 */
export function createProjectErrorResponse(type: ProjectErrorType): Response {
  const { code, message } = PROJECT_ERROR[type];
  return createErrorJsonResponse(code, message);
}
