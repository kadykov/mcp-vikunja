import { server } from '../../../mocks/server';
import { http } from 'msw';
import { createVikunjaTask } from '../../../mocks/factories/vikunja';
import { API_BASE } from '../../../utils/test-helpers';
import { createEmptyResponse } from '../../../utils/test-responses';
import {
  createTaskResponse,
  createTaskListResponse,
  createTaskErrorResponse,
} from '../../../utils/test-utils';
import { VikunjaHttpClient } from '../../../../src/client/http/client';
import { TaskResource } from '../../../../src/client/resource/task';
import type { UpdateTask } from '../../../../src/types';

describe('Task Resource', () => {
  const client = new VikunjaHttpClient({
    config: {
      apiUrl: API_BASE,
      token: 'test-token',
    },
  });
  const taskResource = new TaskResource(client);

  describe('Factory Methods', () => {
    test('should get a task by ID', async () => {
      const testTime = new Date().toISOString();
      const vikunjaTask = createVikunjaTask({
        id: 1,
        title: 'Test Task',
        description: 'Test description',
        project_id: 1,
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
        http.get(`${API_BASE}/tasks/1`, () => {
          return createTaskResponse(vikunjaTask);
        })
      );

      const task = await taskResource.get(1);
      expect(task.title).toBe(vikunjaTask.title);
      expect(task.description).toBe(vikunjaTask.description);
      expect(task.project_id).toBe(vikunjaTask.project_id);
      expect(task.created_by).toMatchObject({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    test('should list all tasks', async () => {
      const testTime = new Date().toISOString();
      const vikunjaTasks = Array(3)
        .fill(null)
        .map((_, i) =>
          createVikunjaTask({
            id: i + 1,
            project_id: 1,
            created: testTime,
            updated: testTime,
          })
        );

      server.use(
        http.get(`${API_BASE}/tasks/all`, () => {
          return createTaskListResponse(vikunjaTasks);
        })
      );

      const tasks = await taskResource.list();
      expect(tasks).toHaveLength(3);
      tasks.forEach((task, index) => {
        expect(task.id).toBe(index + 1);
        expect(task.title).toBeTruthy();
        expect(typeof task.description).toBe('string');
      });
    });
  });

  describe('Instance Methods', () => {
    test('should update task', async () => {
      const testTime = new Date().toISOString();
      const vikunjaTask = createVikunjaTask({
        id: 1,
        title: 'Original Title',
        description: 'Original description',
        project_id: 1,
        created: testTime,
        updated: testTime,
      });

      const updateData: UpdateTask = {
        title: 'Updated Title',
        description: 'Updated description',
      };

      server.use(
        http.get(`${API_BASE}/tasks/1`, () => {
          return createTaskResponse(vikunjaTask);
        }),
        http.post(`${API_BASE}/tasks/1`, () => {
          return createTaskResponse({
            ...vikunjaTask,
            ...updateData,
          });
        })
      );

      const task = await taskResource.get(1);
      await task.update(updateData);
      expect(task.title).toBe(updateData.title);
      expect(task.description).toBe(updateData.description);
    });

    test('should delete task', async () => {
      const vikunjaTask = createVikunjaTask({ id: 1 });

      server.use(
        http.get(`${API_BASE}/tasks/1`, () => {
          return createTaskResponse(vikunjaTask);
        }),
        http.delete(`${API_BASE}/tasks/1`, () => {
          return createEmptyResponse();
        })
      );

      const task = await taskResource.get(1);
      await expect(task.delete()).resolves.toBeUndefined();
    });
  });

  describe('Data Access', () => {
    test('should handle all task properties', async () => {
      const testTime = new Date().toISOString();
      const vikunjaTask = createVikunjaTask({
        id: 1,
        title: 'Test Task',
        description: 'Test description',
        done: true,
        project_id: 1,
        priority: 2,
        percent_done: 50,
        start_date: testTime,
        due_date: testTime,
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
        assignees: [
          {
            id: 2,
            username: 'assignee',
            email: 'assignee@example.com',
            name: 'Test Assignee',
            created: testTime,
            updated: testTime,
          },
        ],
      });

      server.use(
        http.get(`${API_BASE}/tasks/1`, () => {
          return createTaskResponse(vikunjaTask);
        })
      );

      const task = await taskResource.get(1);

      // Basic properties
      expect(task.id).toBe(1);
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test description');
      expect(task.done).toBe(true);
      expect(task.project_id).toBe(1);
      expect(task.priority).toBe(2);
      expect(task.percent_done).toBe(50);

      // Dates
      expect(task.start_date).toBe(testTime);
      expect(task.due_date).toBe(testTime);
      expect(task.created).toBe(testTime);
      expect(task.updated).toBe(testTime);

      // Users
      expect(task.created_by.username).toBe('testuser');
      expect(task.assignees).toHaveLength(1);
      const [assignee] = task.assignees ?? [];
      expect(assignee?.username).toBe('assignee');
    });

    test('should handle missing optional fields', async () => {
      const testTime = new Date().toISOString();
      const vikunjaTask = {
        id: 1,
        title: 'Test Task',
        created: testTime,
        updated: testTime,
      };

      server.use(
        http.get(`${API_BASE}/tasks/1`, () => {
          return createTaskResponse(vikunjaTask);
        })
      );

      const task = await taskResource.get(1);
      expect(task.description).toBe('');
      expect(task.done).toBe(false);
      expect(task.priority).toBe(0);
      expect(task.percent_done).toBe(0);
      expect(task.assignees).toEqual([]);
    });
  });

  describe('Validation', () => {
    test('should require title and project_id for creation', async () => {
      server.use(
        http.get(`${API_BASE}/tasks/1`, () => {
          return createTaskErrorResponse('invalid_input');
        })
      );

      await expect(taskResource.get(1)).rejects.toThrow();
    });

    test('should handle task not found', async () => {
      server.use(
        http.get(`${API_BASE}/tasks/999`, () => {
          return createTaskErrorResponse('not_found');
        })
      );

      await expect(taskResource.get(999)).rejects.toThrow('not found');
    });
  });
});
