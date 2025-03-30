import { server } from '../../../mocks/server';
import { http } from 'msw';
import { factories } from '../../../mocks';
import { API_BASE } from '../../../utils/test-helpers';
import { VikunjaHttpClient } from '../../../../src/client/http/client';
import { ProjectResource } from '../../../../src/client/resource/project';

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
        http.get(`${API_BASE}/projects/123`, () => {
          return Response.json(testProject);
        })
      );

      const result = await projectResource.get(123);
      expect(result).toEqual(testProject);
    });

    test('should handle project not found', async () => {
      server.use(
        http.get(`${API_BASE}/projects/999`, () => {
          return new Response(JSON.stringify({ code: 404, message: 'Project not found' }), {
            status: 404,
          });
        })
      );

      await expect(projectResource.get(999)).rejects.toThrow('Project not found');
    });
  });

  describe('create()', () => {
    test('should create a new project', async () => {
      const newProject = {
        title: 'New Project',
        description: 'Project created in test',
      };

      const createdProject = {
        ...newProject,
        id: 1,
      };

      server.use(
        http.put(`${API_BASE}/projects`, () => {
          return Response.json(createdProject);
        })
      );

      const result = await projectResource.create(newProject);
      expect(result).toMatchObject({
        ...newProject,
        id: expect.any(Number),
      });
    });

    test('should validate required fields', async () => {
      server.use(
        http.put(`${API_BASE}/projects`, () => {
          return new Response(JSON.stringify({ code: 400, message: 'Title is required' }), {
            status: 400,
          });
        })
      );

      await expect(projectResource.create({})).rejects.toThrow('Title is required');
    });
  });

  describe('update()', () => {
    test('should update an existing project', async () => {
      const updateData = {
        title: 'Updated Project',
        description: 'Updated description',
      };

      const updatedProject = {
        ...updateData,
        id: 123,
      };

      server.use(
        http.post(`${API_BASE}/projects/123`, () => {
          return Response.json(updatedProject);
        })
      );

      const result = await projectResource.update(123, updateData);
      expect(result).toMatchObject({
        ...updateData,
        id: 123,
      });
    });

    test('should handle non-existent project update', async () => {
      server.use(
        http.post(`${API_BASE}/projects/999`, () => {
          return new Response(JSON.stringify({ code: 404, message: 'Project not found' }), {
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
        http.delete(`${API_BASE}/projects/123`, () => {
          return new Response(null, { status: 204 });
        })
      );

      await expect(projectResource.delete(123)).resolves.toBeUndefined();
    });

    test('should handle deleting non-existent project', async () => {
      server.use(
        http.delete(`${API_BASE}/projects/999`, () => {
          return new Response(JSON.stringify({ code: 404, message: 'Project not found' }), {
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
        http.get(`${API_BASE}/projects`, () => {
          return Response.json(testProjects);
        })
      );

      const result = await projectResource.list();
      expect(result).toEqual(testProjects);
    });

    test('should handle empty project list', async () => {
      server.use(
        http.get(`${API_BASE}/projects`, () => {
          return Response.json([]);
        })
      );

      const result = await projectResource.list();
      expect(result).toEqual([]);
    });
  });
});
