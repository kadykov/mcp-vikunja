import { server } from '../../../mocks/server';
import { http } from 'msw';
import { createVikunjaProject } from '../../../mocks/factories/vikunja';
import { API_BASE } from '../../../utils/test-helpers';
import { createEmptyResponse } from '../../../utils/test-responses';
import {
  createProjectResponse,
  createProjectListResponse,
  createProjectErrorResponse,
} from '../../../utils/test-utils';
import { VikunjaHttpClient } from '../../../../src/client/http/client';
import { ProjectResource } from '../../../../src/client/resource/project';
import type { Project, CreateProject, UpdateProject } from '../../../../src/types';

describe('ProjectResource', () => {
  const client = new VikunjaHttpClient({
    config: {
      apiUrl: API_BASE,
      token: 'test-token',
    },
  });
  const projectResource = new ProjectResource(client);

  describe('get()', () => {
    test('should transform Vikunja project to our Project type', async () => {
      const testTime = new Date().toISOString();
      const vikunjaProject = createVikunjaProject({
        id: 1,
        title: 'Test Project',
        description: 'Test description',
        created: testTime,
        updated: testTime,
        owner: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          created: testTime,
          updated: testTime,
        },
      });

      server.use(
        http.get(`${API_BASE}/projects/1`, () => {
          return createProjectResponse(vikunjaProject);
        })
      );

      const result = await projectResource.get(1);

      // Only test the fields we explicitly set
      expect(result).toMatchObject({
        id: vikunjaProject.id,
        title: vikunjaProject.title,
        description: vikunjaProject.description,
        created: testTime,
        updated: testTime,
        owner: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          created: testTime,
          updated: testTime,
        },
      });
    });

    test('should handle missing owner data', async () => {
      const vikunjaProject = createVikunjaProject({
        id: 1,
        title: 'Test Project',
        owner: undefined,
      });

      server.use(
        http.get(`${API_BASE}/projects/1`, () => {
          return createProjectResponse(vikunjaProject);
        })
      );

      const result = await projectResource.get(1);
      expect(result.owner).toMatchObject({
        id: 0,
        username: 'unknown',
        email: '',
        name: '',
      });
      expect(typeof result.owner.created).toBe('string');
      expect(typeof result.owner.updated).toBe('string');
    });

    test('should validate required fields', async () => {
      server.use(
        http.get(`${API_BASE}/projects/1`, () => {
          return createProjectErrorResponse('invalid_input');
        })
      );

      await expect(projectResource.get(1)).rejects.toThrow('Title is required');
    });

    test('should handle project not found', async () => {
      server.use(
        http.get(`${API_BASE}/projects/999`, async () => {
          await new Promise(resolve => setTimeout(resolve, 0)); // Simulate async work
          return createProjectErrorResponse('not_found');
        })
      );

      await expect(projectResource.get(999)).rejects.toThrow('Project not found');
    });
  });

  describe('create()', () => {
    test('should create a new project', async () => {
      const newProject: CreateProject = {
        title: 'New Project',
        description: 'Project created in test',
      };

      const createdVikunjaProject = createVikunjaProject({
        id: 1,
        title: newProject.title,
        description: newProject.description,
      });

      server.use(
        http.put(`${API_BASE}/projects`, () => {
          return createProjectResponse(createdVikunjaProject);
        })
      );

      const result = await projectResource.create(newProject);
      const expectedFields: Pick<Project, 'title' | 'description'> = newProject;
      expect(result).toMatchObject(expectedFields);
      expect(result.id).toBe(1);
    });

    test('should validate required fields', async () => {
      // @ts-expect-error Testing invalid input - description without required title
      const invalidProject: CreateProject = { description: 'Missing title' };

      server.use(
        http.put(`${API_BASE}/projects`, () => {
          return createProjectErrorResponse('invalid_input');
        })
      );

      await expect(projectResource.create(invalidProject)).rejects.toThrow('Title is required');
    });
  });

  describe('update()', () => {
    test('should update an existing project', async () => {
      const updateData: UpdateProject = {
        title: 'Updated Project',
        description: 'Updated description',
      };

      const updatedVikunjaProject = createVikunjaProject({
        id: 123,
        ...updateData,
      });

      server.use(
        http.post(`${API_BASE}/projects/123`, () => {
          return createProjectResponse(updatedVikunjaProject);
        })
      );

      const result = await projectResource.update(123, updateData);
      // Only check the fields we updated
      expect(result.title).toBe(updateData.title);
      expect(result.description).toBe(updateData.description);
      expect(result.id).toBe(123);
    });

    test('should handle non-existent project update', async () => {
      server.use(
        http.post(`${API_BASE}/projects/999`, () => {
          return createProjectErrorResponse('not_found');
        })
      );

      await expect(projectResource.update(999, { title: 'Update' })).rejects.toThrow(
        'Project not found'
      );
    });
  });

  describe('delete()', () => {
    test('should delete a project', async () => {
      server.use(
        http.delete(`${API_BASE}/projects/123`, () => {
          return createEmptyResponse();
        })
      );

      await expect(projectResource.delete(123)).resolves.toBeUndefined();
    });

    test('should handle deleting non-existent project', async () => {
      server.use(
        http.delete(`${API_BASE}/projects/999`, () => {
          return createProjectErrorResponse('not_found');
        })
      );

      await expect(projectResource.delete(999)).rejects.toThrow('Project not found');
    });
  });

  describe('list()', () => {
    test('should list projects with pagination', async () => {
      const testTime = new Date().toISOString();
      const vikunjaProjects = Array(5)
        .fill(null)
        .map((_, i) => {
          return createVikunjaProject({
            id: i + 1,
            created: testTime,
            updated: testTime,
          });
        });

      server.use(
        http.get(`${API_BASE}/projects`, () => {
          return createProjectListResponse(vikunjaProjects);
        })
      );

      const result = await projectResource.list();
      // Test essential fields for each project
      result.forEach((project, index) => {
        expect(project.id).toBe(index + 1);
        expect(project.title).toBe('Test Project');
        expect(typeof project.description).toBe('string');
        // Owner fields should be present
        expect(project.owner.id).toBeGreaterThan(0);
        expect(typeof project.owner.username).toBe('string');
        expect(typeof project.owner.email).toBe('string');
        expect(typeof project.owner.name).toBe('string');
      });
    });

    test('should handle empty project list', async () => {
      server.use(
        http.get(`${API_BASE}/projects`, () => {
          return createProjectListResponse([]);
        })
      );

      const result = await projectResource.list();
      expect(result).toEqual([]);
    });
  });
});
