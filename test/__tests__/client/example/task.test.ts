import { server } from '../../../mocks/server';
import { http } from 'msw';
import { factories } from '../../../mocks/index';
import { createErrorResponse } from '../../../mocks/types';
import { apiFetch, apiPut, testData, API_BASE, expectApiError } from '../../../utils/test-helpers';
import type { Task } from '../../../../src/types';

describe('Task API', () => {
  describe('GET /tasks/:id', () => {
    test('should return a task by ID', async () => {
      const testTask = factories.createTask({
        id: 123,
        title: 'Test Task',
        description: 'This is a test task',
      });

      server.use(
        http.get(`${API_BASE}/tasks/:id`, async () => {
          return Response.json({
            data: testTask,
            status: 200,
          });
        })
      );

      const result = await apiFetch<Task>(testData.taskPath(123));

      expect(result.data).toEqual(testTask);
      expect(result.status).toBe(200);
    });

    test('should handle task not found error', async () => {
      await expectApiError(apiFetch(testData.taskPath(999)), 404, 'Task not found');
    });

    test('should handle unauthorized access', async () => {
      server.use(
        http.get(`${API_BASE}/tasks/:id`, async () => {
          return new Response(JSON.stringify(createErrorResponse(403, 'Unauthorized access')), {
            status: 403,
          });
        })
      );

      await expectApiError(apiFetch(testData.taskPath(123)), 403, 'Unauthorized access');
    });
  });

  describe('PUT /projects/:projectId/tasks', () => {
    test('should create a new task in a project', async () => {
      const projectId = 456;
      const newTask = {
        title: 'New Task',
        description: 'Created during test',
      };

      const result = await apiPut<Task>(testData.projectTasksPath(projectId), newTask);

      expect(result.status).toBe(201);
      expect(result.data).toMatchObject({
        ...newTask,
        project_id: projectId,
        id: expect.any(Number),
        created: expect.any(String),
        updated: expect.any(String),
      });
    });

    test('should handle invalid task data', async () => {
      server.use(
        http.put(`${API_BASE}/projects/:projectId/tasks`, async () => {
          return new Response(JSON.stringify(createErrorResponse(400, 'Invalid task data')), {
            status: 400,
          });
        })
      );

      await expectApiError(apiPut(testData.projectTasksPath(456), {}), 400, 'Invalid task data');
    });

    test('should handle project not found error', async () => {
      server.use(
        http.put(`${API_BASE}/projects/:projectId/tasks`, async () => {
          return new Response(JSON.stringify(createErrorResponse(404, 'Project not found')), {
            status: 404,
          });
        })
      );

      await expectApiError(
        apiPut(testData.projectTasksPath(999), { title: 'Task in non-existent project' }),
        404,
        'Project not found'
      );
    });
  });
});
