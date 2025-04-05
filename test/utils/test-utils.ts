import type { VikunjaProject, VikunjaTask } from '../../src/types';
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

/**
 * Success response for a task endpoint
 */
export function createTaskResponse(task: VikunjaTask): Response {
  return createJsonResponse(task);
}

/**
 * Success response for a task list endpoint
 */
export function createTaskListResponse(tasks: VikunjaTask[]): Response {
  return createJsonResponse(tasks);
}

/**
 * Task error type constants
 */
export const TASK_ERROR = {
  not_found: {
    code: 404,
    message: 'Task not found',
  },
  invalid_input: {
    code: 400,
    message: 'Title is required',
  },
} as const;

type TaskErrorType = keyof typeof TASK_ERROR;

/**
 * Error response for a task endpoint with type-safe error codes
 */
export function createTaskErrorResponse(type: TaskErrorType): Response {
  const { code, message } = TASK_ERROR[type];
  return createErrorJsonResponse(code, message);
}
