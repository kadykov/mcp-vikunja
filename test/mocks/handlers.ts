import { http } from 'msw';
import type { Project, Task } from '../../src/types';
import type { ApiSuccessResponse } from './types';
import { createProject, createTask } from './factories';
import { createErrorResponse } from './types';

// API Base URL from environment config
const API_BASE = process.env.VIKUNJA_API_BASE || 'http://localhost:3456/api/v1';

// Base response creators
const success = <T>(data: T, status = 200): ApiSuccessResponse<T> => ({
  data,
  status,
});

/**
 * Project Handlers
 */
export const projectHandlers = [
  // Get Project
  http.get(`${API_BASE}/projects/:id`, async ({ params }) => {
    const id = Number(params.id);

    // Mock "not found" for specific IDs
    if (id === 999) {
      return new Response(JSON.stringify(createErrorResponse(404, 'Project not found')), {
        status: 404,
      });
    }

    return Response.json(success(createProject({ id })));
  }),

  // List Projects
  http.get(`${API_BASE}/projects`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const perPage = Number(url.searchParams.get('per_page')) || 10;

    const projects = Array(perPage)
      .fill(null)
      .map((_, i) => createProject({ id: (page - 1) * perPage + i + 1 }));

    return Response.json(success(projects));
  }),

  // Create Project
  http.put(`${API_BASE}/projects`, async ({ request }) => {
    const data = (await request.json()) as Partial<Project>;
    return Response.json(success(createProject(data)), { status: 201 });
  }),
];

/**
 * Task Handlers
 */
export const taskHandlers = [
  // Get Task
  http.get(`${API_BASE}/tasks/:id`, async ({ params }) => {
    const id = Number(params.id);

    if (id === 999) {
      return new Response(JSON.stringify(createErrorResponse(404, 'Task not found')), {
        status: 404,
      });
    }

    return Response.json(success(createTask({ id })));
  }),

  // Create Task
  http.put(`${API_BASE}/projects/:projectId/tasks`, async ({ request, params }) => {
    const projectId = Number(params.projectId);
    const data = (await request.json()) as Partial<Task>;

    return Response.json(success(createTask({ ...data, project_id: projectId })), { status: 201 });
  }),
];

// Export all handlers
export const handlers = [...projectHandlers, ...taskHandlers];
