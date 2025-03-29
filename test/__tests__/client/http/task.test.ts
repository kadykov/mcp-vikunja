import { server } from '../../../mocks/server';
import { http } from 'msw';
import { factories, createErrorResponse } from '../../../mocks';
import { API_BASE, testData } from '../../../utils/test-helpers';
import { VikunjaHttpClient } from '../../../../src/client/http/client';
import type { Task } from '../../../../src/types';

const client = new VikunjaHttpClient({
  config: {
    apiUrl: API_BASE,
    token: 'test-token',
  },
});

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

      const result = await client.get<{ data: Task }>(testData.taskPath(123));
      expect(result.data).toEqual(testTask);
    });

    test('should handle task not found', async () => {
      server.use(
        http.get(`${API_BASE}/tasks/999`, () => {
          return new Response(JSON.stringify(createErrorResponse(404, 'Task not found')), {
            status: 404,
          });
        })
      );

      await expect(client.get(testData.taskPath(999))).rejects.toThrow('Task not found');
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

      const result = await client.get<{ data: Task[] }>(testData.projectTasksPath(projectId));
      expect(result.data).toEqual(testTasks);
    });

    test('should handle non-existent project', async () => {
      server.use(
        http.get(`${API_BASE}/projects/999/tasks`, () => {
          return new Response(JSON.stringify(createErrorResponse(404, 'Project not found')), {
            status: 404,
          });
        })
      );

      await expect(client.get(testData.projectTasksPath(999))).rejects.toThrow('Project not found');
    });
  });

  describe('PUT /projects/:projectId/tasks', () => {
    test('should create a new task in project', async () => {
      const projectId = 456;
      const newTask = {
        title: 'New Task',
        description: 'Task created in test',
      };

      server.use(
        http.put(`${API_BASE}/projects/${projectId}/tasks`, () => {
          return Response.json({
            data: {
              ...newTask,
              id: 1,
              project_id: projectId,
              created: expect.any(String),
              updated: expect.any(String),
            },
            status: 201,
          });
        })
      );

      const result = await client.put<{ data: Task }>(
        testData.projectTasksPath(projectId),
        newTask
      );
      expect(result.data).toMatchObject({
        ...newTask,
        project_id: projectId,
        id: expect.any(Number),
      });
    });

    test('should validate required fields', async () => {
      server.use(
        http.put(`${API_BASE}/projects/456/tasks`, () => {
          return new Response(JSON.stringify(createErrorResponse(400, 'Title is required')), {
            status: 400,
          });
        })
      );

      await expect(client.put(testData.projectTasksPath(456), {})).rejects.toThrow(
        'Title is required'
      );
    });

    test('should handle creating task in non-existent project', async () => {
      server.use(
        http.put(`${API_BASE}/projects/999/tasks`, () => {
          return new Response(JSON.stringify(createErrorResponse(404, 'Project not found')), {
            status: 404,
          });
        })
      );

      await expect(
        client.put(testData.projectTasksPath(999), { title: 'Test Task' })
      ).rejects.toThrow('Project not found');
    });
  });

  describe('POST /tasks/:id', () => {
    test('should handle non-existent task update', async () => {
      server.use(
        http.post(`${API_BASE}/tasks/999`, () => {
          return new Response(JSON.stringify(createErrorResponse(404, 'Task not found')), {
            status: 404,
          });
        })
      );

      await expect(client.post(testData.taskPath(999), { title: 'Update' })).rejects.toThrow(
        'Task not found'
      );
    });

    test('should update an existing task', async () => {
      const updateData = {
        title: 'Updated Task',
        description: 'Updated description',
      };

      server.use(
        http.post(`${API_BASE}/tasks/123`, () => {
          return Response.json({
            data: {
              ...updateData,
              id: 123,
              created: expect.any(String),
              updated: expect.any(String),
            },
          });
        })
      );

      const result = await client.post<{ data: Task }>(testData.taskPath(123), updateData);
      expect(result.data).toMatchObject({
        ...updateData,
        id: 123,
      });
    });
  });

  describe('DELETE /tasks/:id', () => {
    test('should delete a task', async () => {
      server.use(
        http.delete(`${API_BASE}/tasks/123`, () => {
          return new Response(null, { status: 204 });
        })
      );

      await expect(client.delete(testData.taskPath(123))).resolves.toBeUndefined();
    });

    test('should handle deleting non-existent task', async () => {
      server.use(
        http.delete(`${API_BASE}/tasks/999`, () => {
          return new Response(JSON.stringify(createErrorResponse(404, 'Task not found')), {
            status: 404,
          });
        })
      );

      await expect(client.delete(testData.taskPath(999))).rejects.toThrow('Task not found');
    });
  });
});
