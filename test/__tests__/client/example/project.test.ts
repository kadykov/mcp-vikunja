import { server } from '../../../mocks/server';
import { http } from 'msw';
import { factories } from '../../../mocks/index';
import { createErrorResponse } from '../../../mocks/types';
import { apiFetch, apiPut, testData, API_BASE, expectApiError } from '../../../utils/test-helpers';
import type { Project } from '../../../../src/types';

describe('Project API', () => {
  describe('GET /projects/:id', () => {
    test('should return a project by ID', async () => {
      const testProject = factories.createProject({
        id: 123,
        title: 'Test Project',
        description: 'This is a test project',
      });

      server.use(
        http.get(`${API_BASE}/projects/:id`, async () => {
          return Response.json({
            data: testProject,
            status: 200,
          });
        })
      );

      const result = await apiFetch<Project>(testData.projectPath(123));

      expect(result.data).toEqual(testProject);
      expect(result.status).toBe(200);
    });

    test('should handle project not found error', async () => {
      await expectApiError(apiFetch(testData.projectPath(999)), 404, 'Project not found');
    });

    test('should handle unauthorized access', async () => {
      server.use(
        http.get(`${API_BASE}/projects/:id`, async () => {
          return new Response(JSON.stringify(createErrorResponse(403, 'Unauthorized access')), {
            status: 403,
          });
        })
      );

      await expectApiError(apiFetch(testData.projectPath(123)), 403, 'Unauthorized access');
    });
  });

  describe('GET /projects', () => {
    test('should return list of projects with pagination', async () => {
      const result = await apiFetch<Project[]>('/projects?page=2&per_page=5');

      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBe(5);
      // Check if IDs are correctly paginated (6-10 for page 2)
      expect(result.data.map(p => p.id)).toEqual([6, 7, 8, 9, 10]);
    });
  });

  describe('PUT /projects', () => {
    test('should create a new project', async () => {
      const newProject = {
        title: 'New Project',
        description: 'Created during test',
      };

      const result = await apiPut<Project>('/projects', newProject);

      expect(result.status).toBe(201);
      expect(result.data).toMatchObject({
        ...newProject,
        id: expect.any(Number),
        created: expect.any(String),
        updated: expect.any(String),
      });
    });

    test('should handle validation errors', async () => {
      server.use(
        http.put(`${API_BASE}/projects`, async () => {
          return new Response(JSON.stringify(createErrorResponse(400, 'Title is required')), {
            status: 400,
          });
        })
      );

      await expectApiError(apiPut('/projects', {}), 400, 'Title is required');
    });
  });
});
