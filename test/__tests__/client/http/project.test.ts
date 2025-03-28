import { server } from '../../../mocks/server';
import { http } from 'msw';
import { factories } from '../../../mocks';
import {
  apiFetch,
  apiPut,
  apiPost,
  testData,
  API_BASE,
  expectApiError,
} from '../../../utils/test-helpers';
import type { Project } from '../../../../src/types';

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

      const result = await apiFetch<Project>(testData.projectPath(123));
      expect(result.data).toEqual(testProject);
    });

    test('should handle project not found', async () => {
      await expectApiError(apiFetch(testData.projectPath(999)), 404, 'Project not found');
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

      const result = await apiFetch<Project[]>('/projects?page=1&per_page=5');
      expect(result.data).toEqual(testProjects);
    });
  });

  describe('PUT /projects', () => {
    test('should create a new project', async () => {
      const newProject = {
        title: 'New Project',
        description: 'Project created in test',
      };

      const result = await apiPut<Project>('/projects', newProject);
      expect(result.data).toMatchObject({
        ...newProject,
        id: expect.any(Number),
      });
    });

    test('should validate required fields', async () => {
      await expectApiError(apiPut('/projects', {}), 400, 'Title is required');
    });
  });

  describe('POST /projects/:id', () => {
    test('should update an existing project', async () => {
      const updateData = {
        title: 'Updated Project',
        description: 'Updated description',
      };

      const result = await apiPost<Project>(testData.projectPath(123), updateData);
      expect(result.data).toMatchObject({
        ...updateData,
        id: 123,
      });
    });

    test('should handle non-existent project update', async () => {
      await expectApiError(
        apiPost(testData.projectPath(999), { title: 'Update' }),
        404,
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

      await expect(
        apiFetch(testData.projectPath(123), { method: 'DELETE' })
      ).resolves.toBeDefined();
    });

    test('should handle deleting non-existent project', async () => {
      await expectApiError(
        apiFetch(testData.projectPath(999), { method: 'DELETE' }),
        404,
        'Project not found'
      );
    });
  });
});
