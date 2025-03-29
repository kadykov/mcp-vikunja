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
        http.get(`${API_BASE}/projects/123`, () => {
          return Response.json({
            data: testProject,
          });
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
        http.get(`${API_BASE}/projects`, () => {
          return Response.json({
            data: testProjects,
          });
        })
      );

      const result = await client.get<{ data: Project[] }>('/projects?page=1&per_page=5');
      expect(result.data).toEqual(testProjects);
    });
  });

  describe('PUT /projects', () => {
    test('should create a new project', async () => {
      const newProject = {
        title: 'New Project',
        description: 'Project created in test',
      };

      server.use(
        http.put(`${API_BASE}/projects`, () => {
          return Response.json({
            data: {
              ...newProject,
              id: 1,
              created: expect.any(String),
              updated: expect.any(String),
            },
            status: 201,
          });
        })
      );

      const result = await client.put<{ data: Project }>('/projects', newProject);
      expect(result.data).toMatchObject({
        ...newProject,
        id: expect.any(Number),
      });
    });

    test('should validate required fields', async () => {
      server.use(
        http.put(`${API_BASE}/projects`, () => {
          return new Response(JSON.stringify(createErrorResponse(400, 'Title is required')), {
            status: 400,
          });
        })
      );

      await expect(client.put('/projects', {})).rejects.toThrow('Title is required');
    });
  });

  describe('POST /projects/:id', () => {
    test('should update an existing project', async () => {
      const updateData = {
        title: 'Updated Project',
        description: 'Updated description',
      };

      server.use(
        http.post(`${API_BASE}/projects/123`, () => {
          return Response.json({
            data: {
              ...updateData,
              id: 123,
            },
          });
        })
      );

      const result = await client.post<{ data: Project }>(testData.projectPath(123), updateData);
      expect(result.data).toMatchObject({
        ...updateData,
        id: 123,
      });
    });

    test('should handle non-existent project update', async () => {
      server.use(
        http.post(`${API_BASE}/projects/999`, () => {
          return new Response(JSON.stringify(createErrorResponse(404, 'Project not found')), {
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
        http.delete(`${API_BASE}/projects/123`, () => {
          return new Response(null, { status: 204 });
        })
      );

      await expect(client.delete(testData.projectPath(123))).resolves.toBeUndefined();
    });

    test('should handle deleting non-existent project', async () => {
      server.use(
        http.delete(`${API_BASE}/projects/999`, () => {
          return new Response(JSON.stringify(createErrorResponse(404, 'Project not found')), {
            status: 404,
          });
        })
      );

      await expect(client.delete(testData.projectPath(999))).rejects.toThrow('Project not found');
    });
  });
});
