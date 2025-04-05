import { server } from '../../../mocks/server';
import { http } from 'msw';
import { API_BASE } from '../../../utils/test-helpers';
import { VikunjaHttpClient } from '../../../../src/client/http/client';
import { TaskResource } from '../../../../src/client/resource/task';
import { createVikunjaTask } from '../../../mocks/factories/vikunja';
import {
  createTaskResponse,
  createTaskListResponse,
  createTaskErrorResponse,
} from '../../../utils/test-utils';
import type { CreateTask, UpdateTask } from '../../../../src/types';

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
      const testTime = new Date().toISOString();
      const vikunjaTask = createVikunjaTask({
        id: 123,
        title: 'Test Task',
        description: 'This is a test task',
        created: testTime,
        updated: testTime,
        created_by: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          created: testTime,
          updated: testTime,
        },
      });

      server.use(
        http.get(`${API_BASE}/tasks/123`, () => {
          return createTaskResponse(vikunjaTask);
        })
      );

      const result = await taskResource.get(123);

      // Test essential fields
      expect(result).toMatchObject({
        id: vikunjaTask.id,
        title: vikunjaTask.title,
        description: vikunjaTask.description,
        created: testTime,
        updated: testTime,
      });

      // Test created_by separately
      expect(result.created_by).toMatchObject({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    test('should handle task not found', async () => {
      server.use(
        http.get(`${API_BASE}/tasks/999`, async () => {
          await new Promise(resolve => setTimeout(resolve, 0)); // Simulate async work
          return createTaskErrorResponse('not_found');
        })
      );

      await expect(taskResource.get(999)).rejects.toThrow('Task not found');
    });
  });

  describe('create()', () => {
    test('should create a new task', async () => {
      const newTask: CreateTask = {
        title: 'New Task',
        description: 'Task created in test',
        project_id: 1,
      };

      const createdVikunjaTask = createVikunjaTask({
        id: 1,
        title: newTask.title,
        description: newTask.description,
      });

      server.use(
        http.put(`${API_BASE}/projects/1/tasks`, () => {
          return createTaskResponse(createdVikunjaTask);
        })
      );

      const result = await taskResource.create(newTask);
      expect(result).toMatchObject({
        title: newTask.title,
        description: newTask.description,
        id: 1,
        project_id: 1,
      });
    });

    test('should validate required fields', async () => {
      server.use(
        http.put(`${API_BASE}/projects/1/tasks`, () => {
          return createTaskErrorResponse('invalid_input');
        })
      );

      // @ts-expect-error Testing invalid input without required title
      await expect(taskResource.create({ project_id: 1 })).rejects.toThrow('Title is required');
    });
  });

  describe('update()', () => {
    test('should update an existing task', async () => {
      const updateData: UpdateTask = {
        title: 'Updated Task',
        description: 'Updated description',
      };

      const updatedVikunjaTask = createVikunjaTask({
        id: 123,
        ...updateData,
      });

      server.use(
        http.post(`${API_BASE}/tasks/123`, () => {
          return createTaskResponse(updatedVikunjaTask);
        })
      );

      const result = await taskResource.update(123, updateData);
      expect(result.title).toBe(updateData.title);
      expect(result.description).toBe(updateData.description);
      expect(result.id).toBe(123);
      expect(result.project_id).toBe(1);
    });

    test('should handle non-existent task update', async () => {
      server.use(
        http.post(`${API_BASE}/tasks/999`, () => {
          return createTaskErrorResponse('not_found');
        })
      );

      await expect(taskResource.update(999, { title: 'Update' })).rejects.toThrow('Task not found');
    });
  });

  describe('delete()', () => {
    test('should delete a task', async () => {
      server.use(
        http.delete(`${API_BASE}/tasks/123`, () => {
          return new Response(null, { status: 204 });
        })
      );

      await expect(taskResource.delete(123)).resolves.toBeUndefined();
    });

    test('should handle deleting non-existent task', async () => {
      server.use(
        http.delete(`${API_BASE}/tasks/999`, () => {
          return createTaskErrorResponse('not_found');
        })
      );

      await expect(taskResource.delete(999)).rejects.toThrow('Task not found');
    });
  });

  describe('list()', () => {
    test('should list tasks with pagination', async () => {
      const testTime = new Date().toISOString();
      const vikunjaTasks = Array(2)
        .fill(null)
        .map((_, i) =>
          createVikunjaTask({
            id: i + 1,
            created: testTime,
            updated: testTime,
          })
        );

      server.use(
        http.get(`${API_BASE}/projects/1/tasks`, () => {
          return createTaskListResponse(vikunjaTasks);
        })
      );

      const result = await taskResource.list(1);
      result.forEach((task, index) => {
        expect(task).toMatchObject({
          id: vikunjaTasks[index].id,
          title: 'Test Task',
          description: 'A test task',
          created: testTime,
          updated: testTime,
          project_id: 1,
          created_by: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            name: 'Test User',
          },
        });
      });

      // Verify array length
      expect(result).toHaveLength(vikunjaTasks.length);
    });

    test('should handle empty task list', async () => {
      server.use(
        http.get(`${API_BASE}/projects/1/tasks`, () => {
          return createTaskListResponse([]);
        })
      );

      const result = await taskResource.list(1);
      expect(result).toEqual([]);
    });
  });
});
