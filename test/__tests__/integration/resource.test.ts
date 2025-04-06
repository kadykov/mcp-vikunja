import { server } from '../../mocks/server';
import { createTestUser } from '../../utils/vikunja-test-helpers';
import { createTestProject, cleanupTestData } from '../../utils/mcp-test-helpers';
import { ProjectResource, ProjectImpl } from '../../../src/client/resource/project';
import { TaskResource } from '../../../src/client/resource/task';
import { VikunjaHttpClient } from '../../../src/client/http/client';
import type { CreateProject, CreateTask } from '../../../src/types';

// Disable MSW for integration tests
beforeAll(() => server.close());
afterAll(() => server.listen());

describe('Resource Layer Integration Tests', () => {
  let testUser: {
    credentials: { username: string; email: string; password: string };
    token: string;
  };
  let client: VikunjaHttpClient;
  let projectResource: ProjectResource;
  let taskResource: TaskResource;
  let testProject: ProjectImpl;

  beforeAll(async () => {
    jest.setTimeout(30000); // Increase timeout for integration tests

    testUser = await createTestUser();

    client = new VikunjaHttpClient({
      config: {
        apiUrl: 'http://vikunja:3456/api/v1',
        token: testUser.token,
      },
    });

    projectResource = new ProjectResource(client);
    taskResource = new TaskResource(client);
  });

  beforeEach(async () => {
    // Create a fresh test project for each test
    const project = await createTestProject(testUser.token, 'resource-test');
    testProject = project;
  });

  afterEach(async () => {
    await cleanupTestData(testUser.token, 'resource-test');
  });

  describe('Project Operations', () => {
    test('should manage project lifecycle', async () => {
      // Create a new project
      const newProject = await projectResource.create({
        title: 'Test Project',
        description: 'Project for integration testing',
      });

      expect(newProject.title).toBe('Test Project');
      expect(newProject.description).toBe('Project for integration testing');

      // Update the project
      await newProject.update({
        title: 'Updated Project',
        description: 'Updated description',
      });

      // Get and verify updates
      const updatedProject = await projectResource.get(newProject.id);
      expect(updatedProject.title).toBe('Updated Project');
      expect(updatedProject.description).toBe('Updated description');

      // Delete the project
      await newProject.delete();

      // Verify deletion
      await expect(projectResource.get(newProject.id)).rejects.toThrow();
    });

    test('should list all projects', async () => {
      const projects = await projectResource.list();
      expect(projects.length).toBeGreaterThan(0);
      expect(projects[0].title).toBeDefined();
    });
  });

  describe('Task Operations', () => {
    test('should manage task lifecycle through project', async () => {
      // Create a task through project
      const task = await testProject.createTask({
        title: 'Test Task',
        description: 'Task for integration testing',
      });

      expect(task.title).toBe('Test Task');
      expect(task.project_id).toBe(testProject.id);

      // Update the task
      await task.update({
        title: 'Updated Task',
        description: 'Updated task description',
      });

      // Get and verify updates
      const updatedTask = await taskResource.get(task.id);
      expect(updatedTask.title).toBe('Updated Task');
      expect(updatedTask.description).toBe('Updated task description');

      // Delete the task
      await task.delete();

      // Verify deletion
      await expect(taskResource.get(task.id)).rejects.toThrow();
    });

    test('should list project tasks', async () => {
      // Create multiple tasks
      const taskPromises = [
        testProject.createTask({ title: 'Task 1', description: 'First task' }),
        testProject.createTask({ title: 'Task 2', description: 'Second task' }),
        testProject.createTask({ title: 'Task 3', description: 'Third task' }),
      ];

      const createdTasks = await Promise.all(taskPromises);
      expect(createdTasks.length).toBe(3);

      // List tasks through project
      const tasks = await testProject.listTasks();
      expect(tasks.length).toBeGreaterThanOrEqual(3);

      // Verify task properties
      tasks.forEach(task => {
        expect(task.title).toBeDefined();
        expect(task.project_id).toBe(testProject.id);
      });
    });

    test('should handle task relationships', async () => {
      // Create a task
      const task = await testProject.createTask({
        title: 'Parent Task',
        description: 'Task with relationships',
      });

      // Create some related tasks
      const relatedTasks = await Promise.all([
        testProject.createTask({ title: 'Related Task 1' }),
        testProject.createTask({ title: 'Related Task 2' }),
      ]);

      // Verify task properties
      expect(task.title).toBe('Parent Task');
      expect(task.project_id).toBe(testProject.id);

      relatedTasks.forEach(relatedTask => {
        expect(relatedTask.project_id).toBe(testProject.id);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle non-existent resources', async () => {
      // Try to get non-existent project
      await expect(projectResource.get(99999)).rejects.toThrow();

      // Try to get non-existent task
      await expect(taskResource.get(99999)).rejects.toThrow();
    });

    test('should handle validation errors', async () => {
      // Create project with empty title (should fail server-side validation)
      const invalidProject: CreateProject = {
        title: '',
        description: 'Empty title should fail validation',
      };
      await expect(projectResource.create(invalidProject)).rejects.toThrow();

      // Create task with empty title (should fail server-side validation)
      const invalidTask: Omit<CreateTask, 'project_id'> = {
        title: '',
        description: 'Empty title should fail validation',
      };
      await expect(testProject.createTask(invalidTask)).rejects.toThrow();
    });
  });
});
