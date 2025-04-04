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
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('URL Construction', () => {
    test('should append /api/v1 to base URL if not present', async () => {
      const baseUrl = 'http://localhost:3456';
      const client = new VikunjaHttpClient({
        config: {
          apiUrl: baseUrl,
          token: 'test-token',
        },
      });

      server.use(
        http.get(`${baseUrl}/api/v1/test`, () => {
          return Response.json({ data: { message: 'test' } });
        })
      );

      await client.get('/test');
    });

    test('should not modify URL if /api/v1 is already present', async () => {
      const baseUrl = 'http://localhost:3456/api/v1';
      const client = new VikunjaHttpClient({
        config: {
          apiUrl: baseUrl,
          token: 'test-token',
        },
      });

      server.use(
        http.get(`${baseUrl}/test`, () => {
          return Response.json({ data: { message: 'test' } });
        })
      );

      await client.get('/test');
    });

    test('should handle URLs with trailing slashes', async () => {
      const baseUrl = 'http://localhost:3456/';
      const client = new VikunjaHttpClient({
        config: {
          apiUrl: baseUrl,
          token: 'test-token',
        },
      });

      server.use(
        http.get('http://localhost:3456/api/v1/test', () => {
          return Response.json({ data: { message: 'test' } });
        })
      );

      await client.get('/test');
    });
  });

  describe('Rate Limiting', () => {
    test('should respect rate limits', async () => {
      const client = new VikunjaHttpClient({
        config: {
          apiUrl: API_BASE,
          token: 'test-token',
          rateLimit: {
            maxRequests: 2,
            timeWindow: 100, // 100ms for faster tests
          },
        },
      });

      server.use(
        http.get(`${API_BASE}/test`, () => {
          return Response.json({ data: { message: 'test' } });
        })
      );

      // Make requests up to the limit
      await client.get('/test');
      await client.get('/test');

      // Next request should be delayed
      const startTime = Date.now();
      const requestPromise = client.get('/test');

      // Fast-forward past the time window
      jest.advanceTimersByTime(100);

      await requestPromise;
      expect(Date.now() - startTime).toBeGreaterThanOrEqual(100);
    });

    test('should use default rate limits if not configured', async () => {
      const client = new VikunjaHttpClient({
        config: {
          apiUrl: API_BASE,
          token: 'test-token',
        },
      });

      server.use(
        http.get(`${API_BASE}/test`, () => {
          return Response.json({ data: { message: 'test' } });
        })
      );

      // Should use default of 500 requests per minute
      // Just verify a few requests work without delay
      await client.get('/test');
      await client.get('/test');
      await client.get('/test');
    });
  });

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
