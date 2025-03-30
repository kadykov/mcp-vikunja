import { server } from '../../../mocks/server';
import { http } from 'msw';
import { factories } from '../../../mocks';
import { API_BASE } from '../../../utils/test-helpers';
import { VikunjaHttpClient } from '../../../../src/client/http/client';
import { ProjectResource } from '../../../../src/client/resource/project';
import type { Project } from '../../../../src/types';

describe('ProjectResource', () => {
  const client = new VikunjaHttpClient({
    config: {
      apiUrl: API_BASE,
      token: 'test-token',
    },
  });
  const projectResource = new ProjectResource(client);

  describe('get()', () => {
    test('should get a project by ID', async () => {
      const testProject = factories.createProject({
        id: 123,
        title: 'Test Project',
        description: 'This is a test project',
      });

      server.use(
        http.get(`${API_BASE}/projects/123`, async () => {
          const response = await Promise.resolve(testProject);
          return Response.json(response);
        })
      );

      const result = await projectResource.get(123);
      expect(result).toEqual(testProject);
    });

    test('should handle project not found', async () => {
      server.use(
        http.get(`${API_BASE}/projects/999`, async () => {
          const error = await Promise.resolve({ code: 404, message: 'Project not found' });
          return new Response(JSON.stringify(error), {
            status: 404,
          });
        })
      );

      await expect(projectResource.get(999)).rejects.toThrow('Project not found');
    });
  });

  describe('create()', () => {
    test('should create a new project', async () => {
      type NewProject = Pick<Project, 'title' | 'description'>;
      const newProject: NewProject = {
        title: 'New Project',
        description: 'Project created in test',
      };

      const createdProject: Pick<Project, 'title' | 'description' | 'id'> = {
        ...newProject,
        id: 1,
      };

      server.use(
        http.put(`${API_BASE}/projects`, async () => {
          const response = await Promise.resolve(createdProject);
          return Response.json(response);
        })
      );

      const result = await projectResource.create(newProject);
      const expectedFields: Pick<Project, 'title' | 'description'> = newProject;
      expect(result).toMatchObject(expectedFields);
      expect(result.id).toBe(1);
    });

    test('should validate required fields', async () => {
      server.use(
        http.put(`${API_BASE}/projects`, async () => {
          const error = await Promise.resolve({ code: 400, message: 'Title is required' });
          return new Response(JSON.stringify(error), {
            status: 400,
          });
        })
      );

      await expect(projectResource.create({})).rejects.toThrow('Title is required');
    });
  });

  describe('update()', () => {
    test('should update an existing project', async () => {
      type UpdateProject = Pick<Project, 'title' | 'description'>;
      const updateData: UpdateProject = {
        title: 'Updated Project',
        description: 'Updated description',
      };

      const updatedProject: Pick<Project, 'title' | 'description' | 'id'> = {
        ...updateData,
        id: 123,
      };

      server.use(
        http.post(`${API_BASE}/projects/123`, async () => {
          const response = await Promise.resolve(updatedProject);
          return Response.json(response);
        })
      );

      const result = await projectResource.update(123, updateData);
      const expectedFields: Pick<Project, 'title' | 'description'> = updateData;
      expect(result).toMatchObject(expectedFields);
      expect(result.id).toBe(123);
    });

    test('should handle non-existent project update', async () => {
      server.use(
        http.post(`${API_BASE}/projects/999`, async () => {
          const error = await Promise.resolve({ code: 404, message: 'Project not found' });
          return new Response(JSON.stringify(error), {
            status: 404,
          });
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
        http.delete(`${API_BASE}/projects/123`, async () => {
          await Promise.resolve(); // Simulate async work
          return new Response(null, { status: 204 });
        })
      );

      await expect(projectResource.delete(123)).resolves.toBeUndefined();
    });

    test('should handle deleting non-existent project', async () => {
      server.use(
        http.delete(`${API_BASE}/projects/999`, async () => {
          const error = await Promise.resolve({ code: 404, message: 'Project not found' });
          return new Response(JSON.stringify(error), {
            status: 404,
          });
        })
      );

      await expect(projectResource.delete(999)).rejects.toThrow('Project not found');
    });
  });

  describe('list()', () => {
    test('should list projects with pagination', async () => {
      const testProjects = Array(5)
        .fill(null)
        .map((_, i) => factories.createProject({ id: i + 1 }));

      server.use(
        http.get(`${API_BASE}/projects`, async () => {
          const response = await Promise.resolve(testProjects);
          return Response.json(response);
        })
      );

      const result = await projectResource.list();
      expect(result).toEqual(testProjects);
    });

    test('should handle empty project list', async () => {
      server.use(
        http.get(`${API_BASE}/projects`, async () => {
          const response = await Promise.resolve([]);
          return Response.json(response);
        })
      );

      const result = await projectResource.list();
      expect(result).toEqual([]);
    });
  });
});
