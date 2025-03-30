import { server } from '../../../mocks/server';
import { http } from 'msw';
import { factories, createErrorResponse } from '../../../mocks';
import { API_BASE, testData } from '../../../utils/test-helpers';
import { VikunjaHttpClient } from '../../../../src/client/http/client';
import type { Project } from '../../../../src/types';

const client = new VikunjaHttpClient({
  config: {
    apiUrl: API_BASE,
    token: 'test-token',
  },
});

describe('Project API', () => {
  describe('GET /projects/:id', () => {
    test('should get a project by ID', async () => {
      const testProject = factories.createProject({
        id: 123,
        title: 'Test Project',
        description: 'This is a test project',
      });

      server.use(
        http.get(`${API_BASE}/projects/123`, async () => {
          const response = await Promise.resolve({
            data: testProject,
          });
          return Response.json(response);
        })
      );

      const result = await client.get<{ data: Project }>(testData.projectPath(123));
      expect(result.data).toEqual(testProject);
    });

    test('should handle project not found', async () => {
      await expect(client.get(testData.projectPath(999))).rejects.toThrow('Project not found');
    });
  });

  describe('GET /projects', () => {
    test('should list projects with pagination', async () => {
      const testProjects = Array(5)
        .fill(null)
        .map((_, i) => factories.createProject({ id: i + 1 }));

      server.use(
        http.get(`${API_BASE}/projects`, async () => {
          const response = await Promise.resolve({
            data: testProjects,
          });
          return Response.json(response);
        })
      );

      const result = await client.get<{ data: Project[] }>('/projects?page=1&per_page=5');
      expect(result.data).toEqual(testProjects);
    });
  });

  describe('PUT /projects', () => {
    test('should create a new project', async () => {
      type NewProject = Pick<Project, 'title' | 'description'>;
      const newProject: NewProject = {
        title: 'New Project',
        description: 'Project created in test',
      };

      const responseProject: Project = {
        ...newProject,
        id: 1,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };

      server.use(
        http.put(`${API_BASE}/projects`, async () => {
          const response = await Promise.resolve({
            data: responseProject,
            status: 201,
          });
          return Response.json(response);
        })
      );

      const result = await client.put<{ data: Project }>('/projects', newProject);
      const expectedFields: Pick<Project, 'title' | 'description'> = newProject;
      expect(result.data).toMatchObject(expectedFields);
      expect(result.data.id).toBe(1);
    });

    test('should validate required fields', async () => {
      server.use(
        http.put(`${API_BASE}/projects`, async () => {
          const error = await Promise.resolve(createErrorResponse(400, 'Title is required'));
          return new Response(JSON.stringify(error), {
            status: 400,
          });
        })
      );

      await expect(client.put('/projects', {})).rejects.toThrow('Title is required');
    });
  });

  describe('POST /projects/:id', () => {
    test('should update an existing project', async () => {
      type ProjectUpdate = Pick<Project, 'title' | 'description'>;
      const updateData: ProjectUpdate = {
        title: 'Updated Project',
        description: 'Updated description',
      };

      const updatedProject: Project = {
        ...updateData,
        id: 123,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };

      server.use(
        http.post(`${API_BASE}/projects/123`, async () => {
          const response = await Promise.resolve({
            data: updatedProject,
          });
          return Response.json(response);
        })
      );

      const result = await client.post<{ data: Project }>(testData.projectPath(123), updateData);
      const expectedPartialProject: ProjectUpdate & { id: number } = {
        ...updateData,
        id: 123,
      };
      expect(result.data).toMatchObject(expectedPartialProject);
    });

    test('should handle non-existent project update', async () => {
      server.use(
        http.post(`${API_BASE}/projects/999`, async () => {
          const error = await Promise.resolve(createErrorResponse(404, 'Project not found'));
          return new Response(JSON.stringify(error), {
            status: 404,
          });
        })
      );

      await expect(client.post(testData.projectPath(999), { title: 'Update' })).rejects.toThrow(
        'Project not found'
      );
    });
  });

  describe('DELETE /projects/:id', () => {
    test('should delete a project', async () => {
      server.use(
        http.delete(`${API_BASE}/projects/123`, async () => {
          await Promise.resolve(); // Simulate async work
          return new Response(null, { status: 204 });
        })
      );

      await expect(client.delete(testData.projectPath(123))).resolves.toBeUndefined();
    });

    test('should handle deleting non-existent project', async () => {
      server.use(
        http.delete(`${API_BASE}/projects/999`, async () => {
          const error = await Promise.resolve(createErrorResponse(404, 'Project not found'));
          return new Response(JSON.stringify(error), {
            status: 404,
          });
        })
      );

      await expect(client.delete(testData.projectPath(999))).rejects.toThrow('Project not found');
    });
  });
});
