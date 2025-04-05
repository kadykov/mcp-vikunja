import { server } from '../../mocks/server';
import { createTestUser } from '../../utils/vikunja-test-helpers';
import { createTestProject, cleanupTestData } from '../../utils/mcp-test-helpers';
import { ProjectResource } from '../../../src/client/resource/project';
import { VikunjaHttpClient } from '../../../src/client/http/client';
import { NotFoundError } from '../../../src/client/http/errors';

// Disable MSW for integration tests
beforeAll(() => server.close());
afterAll(() => server.listen());

describe('Project Resource Integration Tests', () => {
  afterAll(async () => {
    await cleanupTestData(testUser.token, 'project-test');
  });
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

      // Add warning about current number of projects
      // console.warn('Currently we have', projects.length, 'projects in the test database');

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
      title: `Test Project [project-test]`,
      description: 'Project created by integration test',
    };

    try {
      const createdProject = await projectResource.create(newProject);

      expect(createdProject.id).toBeDefined();
      expect(createdProject.title).toBe(newProject.title);
      expect(createdProject.description).toBe(newProject.description);
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
    // First create a project
    const created = await createTestProject(testUser.token, 'project-test');
    expect(created.id).toBeDefined();

    // Then get it by ID
    const project = await projectResource.get(created.id);

    expect(project.id).toBe(created.id);
    expect(project.title).toBe(created.title);
    expect(project.description).toBe(created.description);
  });

  test('should delete a project', async () => {
    // Create a test project
    const created = await createTestProject(testUser.token, 'project-test');
    expect(created.id).toBeDefined();

    // Delete the project
    await projectResource.delete(created.id);

    // Verify the project is deleted by attempting to get it
    await expect(projectResource.get(created.id)).rejects.toThrow(NotFoundError);

    // Verify the specific Vikunja error code
    try {
      await projectResource.get(created.id);
    } catch (err: unknown) {
      if (err instanceof NotFoundError) {
        expect(err.code).toBe(3001); // Vikunja's not found code
      } else {
        throw err;
      }
    }
  });
});
