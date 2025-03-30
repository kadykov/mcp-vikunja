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
        http.get(`${API_BASE}/tasks/123`, async () => {
          const response = await Promise.resolve({
            data: testTask,
          });
          return Response.json(response);
        })
      );

      const result = await client.get<{ data: Task }>(testData.taskPath(123));
      expect(result.data).toStrictEqual(testTask);
    });

    test('should handle task not found', async () => {
      server.use(
        http.get(`${API_BASE}/tasks/999`, async () => {
          const error = await Promise.resolve(createErrorResponse(404, 'Task not found'));
          return new Response(JSON.stringify(error), {
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
        http.get(`${API_BASE}/projects/${projectId}/tasks`, async () => {
          const response = await Promise.resolve({
            data: testTasks,
          });
          return Response.json(response);
        })
      );

      const result = await client.get<{ data: Task[] }>(testData.projectTasksPath(projectId));
      expect(result.data).toEqual(testTasks);
    });

    test('should handle non-existent project', async () => {
      server.use(
        http.get(`${API_BASE}/projects/999/tasks`, async () => {
          const error = await Promise.resolve(createErrorResponse(404, 'Project not found'));
          return new Response(JSON.stringify(error), {
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
      type NewTask = Pick<Task, 'title' | 'description'>;
      const newTask: NewTask = {
        title: 'New Task',
        description: 'Task created in test',
      };

      server.use(
        http.put(`${API_BASE}/projects/${projectId}/tasks`, async () => {
          const taskResponse: Task = {
            ...newTask,
            id: 1,
            project_id: projectId,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            done: false,
          };
          const response = await Promise.resolve({
            data: taskResponse,
            status: 201,
          });
          return Response.json(response);
        })
      );

      const result = await client.put<{ data: Task }>(
        testData.projectTasksPath(projectId),
        newTask
      );
      const expectedFields: Pick<Task, 'title' | 'description'> = newTask;
      expect(result.data).toMatchObject(expectedFields);
      expect(result.data.project_id).toBe(projectId);
      expect(result.data.id).toBe(1);
    });

    test('should validate required fields', async () => {
      server.use(
        http.put(`${API_BASE}/projects/456/tasks`, async () => {
          const error = await Promise.resolve(createErrorResponse(400, 'Title is required'));
          return new Response(JSON.stringify(error), {
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
        http.put(`${API_BASE}/projects/999/tasks`, async () => {
          const error = await Promise.resolve(createErrorResponse(404, 'Project not found'));
          return new Response(JSON.stringify(error), {
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
        http.post(`${API_BASE}/tasks/999`, async () => {
          const error = await Promise.resolve(createErrorResponse(404, 'Task not found'));
          return new Response(JSON.stringify(error), {
            status: 404,
          });
        })
      );

      await expect(client.post(testData.taskPath(999), { title: 'Update' })).rejects.toThrow(
        'Task not found'
      );
    });

    test('should update an existing task', async () => {
      type TaskUpdate = Pick<Task, 'title' | 'description'>;
      const updateData: TaskUpdate = {
        title: 'Updated Task',
        description: 'Updated description',
      };

      server.use(
        http.post(`${API_BASE}/tasks/123`, async () => {
          const taskResponse: Task = {
            ...updateData,
            id: 123,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            done: false,
            project_id: 1,
          };
          const response = await Promise.resolve({
            data: taskResponse,
          });
          return Response.json(response);
        })
      );

      const result = await client.post<{ data: Task }>(testData.taskPath(123), updateData);
      const expectedFields: Pick<Task, 'title' | 'description'> = updateData;
      expect(result.data).toMatchObject(expectedFields);
      expect(result.data.id).toBe(123);
    });
  });

  describe('DELETE /tasks/:id', () => {
    test('should delete a task', async () => {
      server.use(
        http.delete(`${API_BASE}/tasks/123`, async () => {
          await Promise.resolve(); // Simulate async work
          return new Response(null, { status: 204 });
        })
      );

      await expect(client.delete(testData.taskPath(123))).resolves.toBeUndefined();
    });

    test('should handle deleting non-existent task', async () => {
      server.use(
        http.delete(`${API_BASE}/tasks/999`, async () => {
          const error = await Promise.resolve(createErrorResponse(404, 'Task not found'));
          return new Response(JSON.stringify(error), {
            status: 404,
          });
        })
      );

      await expect(client.delete(testData.taskPath(999))).rejects.toThrow('Task not found');
    });
  });
});
