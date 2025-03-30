import { server } from '../../../mocks/server';
import { http } from 'msw';
import { factories, createErrorResponse } from '../../../mocks';
import { API_BASE } from '../../../utils/test-helpers';
import { VikunjaHttpClient } from '../../../../src/client/http/client';
import { TaskResource } from '../../../../src/client/resource/task';
import type { Task } from '../../../../src/types';

describe('TaskResource', () => {
  const client = new VikunjaHttpClient({
    config: {
      apiUrl: API_BASE,
      token: 'test-token',
    },
  });
  const taskResource = new TaskResource(client);

  describe('get()', () => {
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

      const result = await taskResource.get(123);
      expect(result).toEqual(testTask);
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

      await expect(taskResource.get(999)).rejects.toThrow('Task not found');
    });
  });

  describe('create()', () => {
    test('should create a new task', async () => {
      type NewTask = Pick<Task, 'title' | 'description'>;
      const newTask: NewTask = {
        title: 'New Task',
        description: 'Task created in test',
      };

      const createdTask: Pick<Task, 'title' | 'description' | 'id' | 'project_id'> = {
        ...newTask,
        id: 1,
        project_id: 1,
      };

      server.use(
        http.put(`${API_BASE}/projects/1/tasks`, async () => {
          const response = await Promise.resolve({
            data: createdTask,
          });
          return Response.json(response);
        })
      );

      const result = await taskResource.create(newTask);
      const expectedFields: Pick<Task, 'title' | 'description'> = newTask;
      expect(result).toMatchObject(expectedFields);
      expect(result.id).toBe(1);
      expect(result.project_id).toBe(1);
    });

    test('should validate required fields', async () => {
      server.use(
        http.put(`${API_BASE}/projects/1/tasks`, async () => {
          const error = await Promise.resolve(createErrorResponse(400, 'Title is required'));
          return new Response(JSON.stringify(error), {
            status: 400,
          });
        })
      );

      await expect(taskResource.create({})).rejects.toThrow('Title is required');
    });
  });

  describe('update()', () => {
    test('should update an existing task', async () => {
      type UpdateTask = Pick<Task, 'title' | 'description'>;
      const updateData: UpdateTask = {
        title: 'Updated Task',
        description: 'Updated description',
      };

      const updatedTask: Pick<Task, 'title' | 'description' | 'id' | 'project_id'> = {
        ...updateData,
        id: 123,
        project_id: 1,
      };

      server.use(
        http.post(`${API_BASE}/tasks/123`, async () => {
          const response = await Promise.resolve({
            data: updatedTask,
          });
          return Response.json(response);
        })
      );

      const result = await taskResource.update(123, updateData);
      const expectedFields: Pick<Task, 'title' | 'description'> = updateData;
      expect(result).toMatchObject(expectedFields);
      expect(result.id).toBe(123);
      expect(result.project_id).toBe(1);
    });

    test('should handle non-existent task update', async () => {
      server.use(
        http.post(`${API_BASE}/tasks/999`, async () => {
          const error = await Promise.resolve(createErrorResponse(404, 'Task not found'));
          return new Response(JSON.stringify(error), {
            status: 404,
          });
        })
      );

      await expect(taskResource.update(999, { title: 'Update' })).rejects.toThrow('Task not found');
    });
  });

  describe('delete()', () => {
    test('should delete a task', async () => {
      server.use(
        http.delete(`${API_BASE}/tasks/123`, async () => {
          await Promise.resolve(); // Simulate async work
          return new Response(null, { status: 204 });
        })
      );

      await expect(taskResource.delete(123)).resolves.toBeUndefined();
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

      await expect(taskResource.delete(999)).rejects.toThrow('Task not found');
    });
  });

  describe('list()', () => {
    test('should list tasks with pagination', async () => {
      const testTasks = Array(5)
        .fill(null)
        .map((_, i) => factories.createTask({ id: i + 1, project_id: 1 }));

      server.use(
        http.get(`${API_BASE}/projects/1/tasks`, async () => {
          const response = await Promise.resolve({
            data: testTasks,
          });
          return Response.json(response);
        })
      );

      const result = await taskResource.list();
      expect(result).toEqual(testTasks);
    });

    test('should handle empty task list', async () => {
      server.use(
        http.get(`${API_BASE}/projects/1/tasks`, async () => {
          const response = await Promise.resolve({
            data: [],
          });
          return Response.json(response);
        })
      );

      const result = await taskResource.list();
      expect(result).toEqual([]);
    });
  });
});
