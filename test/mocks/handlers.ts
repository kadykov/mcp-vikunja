import { http } from 'msw';
import type { Project, Task } from '../../src/types';
import type { ApiSuccessResponse } from './types';
import { createProject, createTask } from './factories';
import { createErrorResponse } from './types';

// API Base URL from environment config
const API_BASE = process.env.VIKUNJA_API_BASE || 'http://localhost:3456/api/v1';

// Base response creators
const success = <T>(data: T, status?: number): ApiSuccessResponse<T> => ({
  data,
  status: status || 200,
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
      const errorResponse = await Promise.resolve(createErrorResponse(404, 'Project not found'));
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
      });
    }

    const project = await Promise.resolve(createProject({ id }));
    return Response.json(success(project));
  }),

  // List Projects
  http.get(`${API_BASE}/projects`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const perPage = Number(url.searchParams.get('per_page')) || 10;

    const projects = await Promise.all(
      Array(perPage)
        .fill(null)
        .map((_, i) => ({ id: (page - 1) * perPage + i + 1 }))
    );

    // Create all projects in parallel
    const projectsList = await Promise.all(
      projects.map(async p => {
        const project = await Promise.resolve(createProject(p));
        return project;
      })
    );
    return Response.json(success(projectsList));
  }),

  // Create Project
  http.put(`${API_BASE}/projects`, async ({ request }) => {
    const data = (await request.json()) as Partial<Project>;
    const project = await Promise.resolve(createProject(data));
    return Response.json(success(project, 201));
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
      const errorResponse = await Promise.resolve(createErrorResponse(404, 'Task not found'));
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
      });
    }

    const task = await Promise.resolve(createTask({ id }));
    return Response.json(success(task));
  }),

  // Create Task
  http.put(`${API_BASE}/projects/:projectId/tasks`, async ({ request, params }) => {
    const projectId = Number(params.projectId);
    const data = (await request.json()) as Partial<Task>;
    const task = await Promise.resolve(createTask({ ...data, project_id: projectId }));

    return Response.json(success(task, 201));
  }),
];

// Export all handlers
export const handlers = [...projectHandlers, ...taskHandlers];
