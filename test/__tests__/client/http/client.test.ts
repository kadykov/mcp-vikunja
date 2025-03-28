import { server } from '../../../mocks/server';
import { http } from 'msw';
import { apiFetch, apiPut, apiPost, API_BASE, expectApiError } from '../../../utils/test-helpers';

describe('HTTP Client', () => {
  describe('Request Headers', () => {
    test('should include auth token in headers', async () => {
      server.use(
        http.get(`${API_BASE}/test`, ({ request }) => {
          expect(request.headers.get('Authorization')).toBeTruthy();
          expect(request.headers.get('Content-Type')).toBe('application/json');
          return Response.json({ data: { message: 'test' } });
        })
      );

      await apiFetch('/test');
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      server.use(
        http.get(`${API_BASE}/test`, () => {
          return new Response(null, { status: 0 });
        })
      );

      await expectApiError(apiFetch('/test'), 0, 'Network error occurred');
    });

    test('should handle timeout errors', async () => {
      server.use(
        http.get(`${API_BASE}/test`, async () => {
          await new Promise(resolve => setTimeout(resolve, 5000));
          return Response.json({ data: {} });
        })
      );

      await expectApiError(apiFetch('/test'), 408, 'Request timeout');
    });

    test('should handle server errors', async () => {
      server.use(
        http.get(`${API_BASE}/test`, () => {
          return new Response(null, { status: 500 });
        })
      );

      await expectApiError(apiFetch('/test'), 500, 'Internal server error');
    });

    test('should handle invalid JSON responses', async () => {
      server.use(
        http.get(`${API_BASE}/test`, () => {
          return new Response('invalid json');
        })
      );

      await expectApiError(apiFetch('/test'), 400, 'Invalid JSON response');
    });
  });

  describe('Request Methods', () => {
    test('should make PUT request with data', async () => {
      const testData = { message: 'test' };

      server.use(
        http.put(`${API_BASE}/test`, async ({ request }) => {
          const body = await request.json();
          expect(body).toEqual(testData);
          return Response.json({ data: body });
        })
      );

      const result = await apiPut('/test', testData);
      expect(result.data).toEqual(testData);
    });

    test('should make POST request with data', async () => {
      const testData = { message: 'test' };

      server.use(
        http.post(`${API_BASE}/test`, async ({ request }) => {
          const body = await request.json();
          expect(body).toEqual(testData);
          return Response.json({ data: body });
        })
      );

      const result = await apiPost('/test', testData);
      expect(result.data).toEqual(testData);
    });

    test('should make DELETE request', async () => {
      server.use(
        http.delete(`${API_BASE}/test`, () => {
          return new Response(null, { status: 204 });
        })
      );

      await expect(apiFetch('/test', { method: 'DELETE' })).resolves.toBeDefined();
    });
  });
});
