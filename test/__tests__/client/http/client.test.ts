import { server } from '../../../mocks/server';
import { http } from 'msw';
import { API_BASE } from '../../../utils/test-helpers';
import { createErrorResponse } from '../../../mocks/types';
import { VikunjaHttpClient } from '../../../../src/client/http/client';

const client = new VikunjaHttpClient({
  config: {
    apiUrl: API_BASE,
    token: 'test-token',
  },
});

describe('HTTP Client', () => {
  describe('Request Headers', () => {
    test('should include auth token in headers', async () => {
      server.use(
        http.get(`${API_BASE}/test`, async ({ request }) => {
          const headers = await Promise.resolve({
            auth: request.headers.get('Authorization'),
            contentType: request.headers.get('Content-Type'),
          });
          expect(headers.auth).toBeTruthy();
          expect(headers.contentType).toBe('application/json');
          return Response.json({ data: { message: 'test' } });
        })
      );

      await client.get('/test');
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      server.use(
        http.get(`${API_BASE}/test`, async () => {
          await Promise.resolve(); // Simulate async work
          const error = await Promise.resolve(Response.error());
          return error;
        })
      );

      await expect(client.get('/test')).rejects.toThrow('Network error occurred');
    });

    test('should handle timeout errors', async () => {
      server.use(
        http.get(`${API_BASE}/test`, async () => {
          const error = await Promise.resolve(createErrorResponse(408, 'Request timeout'));
          return new Response(JSON.stringify(error), {
            status: 408,
          });
        })
      );

      await expect(client.get('/test')).rejects.toThrow('Request timeout');
    });

    test('should handle server errors', async () => {
      server.use(
        http.get(`${API_BASE}/test`, async () => {
          const response = await Promise.resolve(createErrorResponse(500, 'Internal server error'));
          return new Response(JSON.stringify(response), {
            status: 500,
          });
        })
      );

      await expect(client.get('/test')).rejects.toThrow('Internal server error');
    });

    test('should handle invalid JSON responses', async () => {
      server.use(
        http.get(`${API_BASE}/test`, () => {
          return new Response('invalid json{', {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        })
      );

      await expect(client.get('/test')).rejects.toThrow('Invalid JSON response');
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

      const result = await client.put<{ data: { message: string } }>('/test', testData);
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

      const result = await client.post<{ data: { message: string } }>('/test', testData);
      expect(result.data).toEqual(testData);
    });

    test('should make DELETE request', async () => {
      server.use(
        http.delete(`${API_BASE}/test`, async () => {
          await Promise.resolve(); // Simulate async work
          return Response.json({ status: 204 });
        })
      );

      await expect(client.delete('/test')).resolves.toBeUndefined();
    });
  });
});
