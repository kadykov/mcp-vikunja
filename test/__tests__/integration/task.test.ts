import { server } from '../../mocks/server';
import { createTestUser } from '../../utils/vikunja-test-helpers';
import { TaskResource } from '../../../src/client/resource/task';
import { ProjectResource } from '../../../src/client/resource/project';
import { VikunjaHttpClient } from '../../../src/client/http/client';

// Disable MSW for integration tests
beforeAll(() => server.close());
afterAll(() => server.listen());

describe('Task Resource Integration Tests', () => {
  let testUser: {
    credentials: { username: string; email: string; password: string };
    token: string;
  };
  let taskResource: TaskResource;
  let projectResource: ProjectResource;
  let testProjectId: number;

  beforeAll(async () => {
    jest.setTimeout(30000); // Increase timeout to 30 seconds for integration tests

    testUser = await createTestUser();

    const client = new VikunjaHttpClient({
      config: {
        apiUrl: 'http://vikunja:3456/api/v1',
        token: testUser.token,
      },
    });
    taskResource = new TaskResource(client);
    projectResource = new ProjectResource(client);

    // Create a test project to use for task operations
    try {
      const project = await projectResource.create({
        title: 'Test Project for Tasks',
        description: 'Project for task integration tests',
      });
      if (!project.id) {
        throw new Error('Created project missing ID');
      }
      testProjectId = project.id;
    } catch (error) {
      console.error('Failed to create test project:', error);
      throw error;
    }
  });

  // Basic connectivity test
  test('should list tasks', async () => {
    try {
      const tasks = await taskResource.list(testProjectId);

      // More detailed assertions
      expect(typeof tasks).toBe('object');
      expect(tasks).not.toBeNull();
      expect(Array.isArray(tasks)).toBe(true);

      // Check structure of any tasks if they exist
      if (tasks.length > 0) {
        expect(tasks[0]).toHaveProperty('id');
        expect(tasks[0]).toHaveProperty('title');
        expect(tasks[0]).toHaveProperty('project_id');
      }
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { status: number; data: unknown } };
        console.error(
          'Error listing tasks:',
          axiosError.response?.status,
          axiosError.response?.data
        );
      } else {
        console.error('Unknown error:', error);
      }
      throw error;
    }
  });

  // CRUD operations test
  test('should create a new task', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'Task created by integration test',
      project_id: testProjectId,
    };

    try {
      const task = await taskResource.create(newTask);

      expect(task.id).toBeDefined();
      expect(task.title).toBe(newTask.title);
      expect(task.description).toBe(newTask.description);
      expect(task.project_id).toBe(testProjectId);
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { status: number; data: unknown } };
        console.error(
          'Error creating task:',
          axiosError.response?.status,
          axiosError.response?.data
        );
      } else {
        console.error('Unknown error:', error);
      }
      throw error;
    }
  });

  test('should get a task by ID', async () => {
    try {
      // First create a task
      const newTask = {
        title: 'Task to Get',
        description: 'Task for testing get by ID',
        project_id: testProjectId,
      };
      const created = await taskResource.create(newTask);
      if (!created.id) {
        throw new Error('Created task missing ID');
      }

      // Then get it by ID
      const task = await taskResource.get(created.id);

      expect(task.id).toBe(created.id);
      expect(task.title).toBe(newTask.title);
      expect(task.description).toBe(newTask.description);
      expect(task.project_id).toBe(testProjectId);
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { status: number; data: unknown } };
        console.error(
          'Error getting task:',
          axiosError.response?.status,
          axiosError.response?.data
        );
      } else {
        console.error('Unknown error:', error);
      }
      throw error;
    }
  });

  test('should update a task', async () => {
    try {
      // First create a task
      const newTask = {
        title: 'Task to Update',
        description: 'Task for testing update',
        project_id: testProjectId,
      };
      const created = await taskResource.create(newTask);
      if (!created.id) {
        throw new Error('Created task missing ID');
      }

      // Then update it
      const updateData = {
        title: 'Updated Task',
        description: 'Updated task description',
      };

      const updated = await taskResource.update(created.id, updateData);

      expect(updated.id).toBe(created.id);
      expect(updated.title).toBe(updateData.title);
      expect(updated.description).toBe(updateData.description);
      expect(updated.project_id).toBe(testProjectId);
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { status: number; data: unknown } };
        console.error(
          'Error updating task:',
          axiosError.response?.status,
          axiosError.response?.data
        );
      } else {
        console.error('Unknown error:', error);
      }
      throw error;
    }
  });

  test('should delete a task', async () => {
    try {
      // First create a task
      const newTask = {
        title: 'Task to Delete',
        description: 'Task for testing deletion',
        project_id: testProjectId,
      };
      const created = await taskResource.create(newTask);
      if (!created.id) {
        throw new Error('Created task missing ID');
      }

      // Then delete it
      await taskResource.delete(created.id);

      // Verify deletion by attempting to get the task
      await expect(taskResource.get(created.id)).rejects.toThrow();
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { status: number; data: unknown } };
        console.error(
          'Error in delete task test:',
          axiosError.response?.status,
          axiosError.response?.data
        );
      } else {
        console.error('Unknown error:', error);
      }
      throw error;
    }
  });
});
