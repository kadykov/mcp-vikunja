import { server } from '../../mocks/server';
import { createTestUser } from '../../utils/vikunja-test-helpers';
import { ProjectResource } from '../../../src/client/resource/project';
import { VikunjaHttpClient } from '../../../src/client/http/client';
import { NotFoundError } from '../../../src/client/http/errors';

// Disable MSW for integration tests
beforeAll(() => server.close());
afterAll(() => server.listen());

describe('Project Resource Integration Tests', () => {
  let testUser: {
    credentials: { username: string; email: string; password: string };
    token: string;
  };
  let projectResource: ProjectResource;

  beforeAll(async () => {
    jest.setTimeout(30000); // Increase timeout to 30 seconds for integration tests

    testUser = await createTestUser();

    const client = new VikunjaHttpClient({
      config: {
        apiUrl: 'http://vikunja:3456/api/v1',
        token: testUser.token,
      },
    });
    projectResource = new ProjectResource(client);
  });

  test('should throw NotFoundError with Vikunja code for non-existent project', async () => {
    const nonExistentId = 999999999;
    await expect(projectResource.get(nonExistentId)).rejects.toThrow(NotFoundError);

    // Test for specific Vikunja error code
    try {
      await projectResource.get(nonExistentId);
    } catch (err: unknown) {
      if (err instanceof NotFoundError) {
        expect(err.code).toBe(3001);
      } else {
        throw err;
      }
    }
  });

  // Basic connectivity test
  test('should list projects', async () => {
    try {
      const projects = await projectResource.list();

      // More detailed assertions
      expect(typeof projects).toBe('object');
      expect(projects).not.toBeNull();
      expect(Array.isArray(projects)).toBe(true);

      // Check structure of any projects if they exist
      if (projects.length > 0) {
        expect(projects[0]).toHaveProperty('id');
        expect(projects[0]).toHaveProperty('title');
      }
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { status: number; data: unknown } };
        console.error(
          'Error listing projects:',
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
  test('should create a new project', async () => {
    const newProject = {
      title: 'Test Project',
      description: 'Project created by integration test',
    };

    try {
      const project = await projectResource.create(newProject);

      expect(project.id).toBeDefined();
      expect(project.title).toBe(newProject.title);
      expect(project.description).toBe(newProject.description);
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { status: number; data: unknown } };
        console.error(
          'Error creating project:',
          axiosError.response?.status,
          axiosError.response?.data
        );
      } else {
        console.error('Unknown error:', error);
      }
      throw error;
    }
  });

  test('should get a project by ID', async () => {
    try {
      // First create a project
      const newProject = {
        title: 'Project to Get',
        description: 'Project for testing get by ID',
      };
      const created = await projectResource.create(newProject);
      if (!created.id) {
        throw new Error('Created project missing ID');
      }

      // Then get it by ID
      const project = await projectResource.get(created.id);

      expect(project.id).toBe(created.id);
      expect(project.title).toBe(newProject.title);
      expect(project.description).toBe(newProject.description);
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { status: number; data: unknown } };
        console.error(
          'Error getting project:',
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
