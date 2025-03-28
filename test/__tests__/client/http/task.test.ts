import { server } from '../../../mocks/server';
import { http } from 'msw';
import { factories } from '../../../mocks';
import {
  apiFetch,
  apiPut,
  apiPost,
  testData,
  API_BASE,
  expectApiError,
} from '../../../utils/test-helpers';
import type { Task } from '../../../../src/types';

describe('Task API', () => {
  describe('GET /tasks/:id', () => {
    test('should get a task by ID', async () => {
      const testTask = factories.createTask({
        id: 123,
        title: 'Test Task',
        description: 'This is a test task',
      });

      server.use(
        http.get(`${API_BASE}/tasks/123`, () => {
          return Response.json({
            data: testTask,
          });
        })
      );

      const result = await apiFetch<Task>(testData.taskPath(123));
      expect(result.data).toEqual(testTask);
    });

    test('should handle task not found', async () => {
      await expectApiError(apiFetch(testData.taskPath(999)), 404, 'Task not found');
    });
  });

  describe('GET /projects/:projectId/tasks', () => {
    test('should list tasks for a project with pagination', async () => {
      const projectId = 456;
      const testTasks = Array(5)
        .fill(null)
        .map((_, i) =>
          factories.createTask({
            id: i + 1,
            project_id: projectId,
          })
        );

      server.use(
        http.get(`${API_BASE}/projects/${projectId}/tasks`, () => {
          return Response.json({
            data: testTasks,
          });
        })
      );

      const result = await apiFetch<Task[]>(testData.projectTasksPath(projectId));
      expect(result.data).toEqual(testTasks);
    });

    test('should handle non-existent project', async () => {
      await expectApiError(apiFetch(testData.projectTasksPath(999)), 404, 'Project not found');
    });
  });

  describe('PUT /projects/:projectId/tasks', () => {
    test('should create a new task in project', async () => {
      const projectId = 456;
      const newTask = {
        title: 'New Task',
        description: 'Task created in test',
      };

      const result = await apiPut<Task>(testData.projectTasksPath(projectId), newTask);
      expect(result.data).toMatchObject({
        ...newTask,
        project_id: projectId,
        id: expect.any(Number),
      });
    });

    test('should validate required fields', async () => {
      await expectApiError(apiPut(testData.projectTasksPath(456), {}), 400, 'Title is required');
    });

    test('should handle creating task in non-existent project', async () => {
      await expectApiError(
        apiPut(testData.projectTasksPath(999), { title: 'Test Task' }),
        404,
        'Project not found'
      );
    });
  });

  describe('POST /tasks/:id', () => {
    test('should update an existing task', async () => {
      const updateData = {
        title: 'Updated Task',
        description: 'Updated description',
      };

      const result = await apiPost<Task>(testData.taskPath(123), updateData);
      expect(result.data).toMatchObject({
        ...updateData,
        id: 123,
      });
    });

    test('should handle non-existent task update', async () => {
      await expectApiError(
        apiPost(testData.taskPath(999), { title: 'Update' }),
        404,
        'Task not found'
      );
    });
  });

  describe('DELETE /tasks/:id', () => {
    test('should delete a task', async () => {
      server.use(
        http.delete(`${API_BASE}/tasks/123`, () => {
          return new Response(null, { status: 204 });
        })
      );

      await expect(apiFetch(testData.taskPath(123), { method: 'DELETE' })).resolves.toBeDefined();
    });

    test('should handle deleting non-existent task', async () => {
      await expectApiError(
        apiFetch(testData.taskPath(999), { method: 'DELETE' }),
        404,
        'Task not found'
      );
    });
  });
});
