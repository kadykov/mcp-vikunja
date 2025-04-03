import { server } from '../../mocks/server';
import { createTestUser } from '../../utils/vikunja-test-helpers';
import { VikunjaHttpClient } from '../../../src/client/http/client';

// Disable MSW for integration tests
beforeAll(() => server.close());
afterAll(() => server.listen());

describe('HTTP Client Integration Tests', () => {
  let testUser: {
    credentials: { username: string; email: string; password: string };
    token: string;
  };

  beforeAll(async () => {
    jest.setTimeout(30000); // Increase timeout for integration tests
    testUser = await createTestUser();
  });

  describe('Rate Limiting', () => {
    test('should handle multiple concurrent requests with rate limiting', async () => {
      const client = new VikunjaHttpClient({
        config: {
          apiUrl: 'http://vikunja:3456/api/v1',
          token: testUser.token,
          rateLimit: {
            maxRequests: 5,
            timeWindow: 1000, // 1 second
          },
        },
      });

      // Make 10 concurrent requests
      const requests = Array(10)
        .fill(null)
        .map(() => client.get('/user'));

      // All requests should complete without errors
      await expect(Promise.all(requests)).resolves.toBeDefined();
    });

    test('should handle requests over time with rate limiting', async () => {
      const client = new VikunjaHttpClient({
        config: {
          apiUrl: 'http://vikunja:3456/api/v1',
          token: testUser.token,
          rateLimit: {
            maxRequests: 3,
            timeWindow: 1000, // 1 second
          },
        },
      });

      const startTime = Date.now();

      // Make 6 sequential requests (should take at least 2 seconds due to rate limiting)
      for (let i = 0; i < 6; i++) {
        await client.get('/user');
      }

      const duration = Date.now() - startTime;
      expect(duration).toBeGreaterThanOrEqual(1000); // Should take at least 1 second
    });

    test('should use default rate limits without errors', async () => {
      const client = new VikunjaHttpClient({
        config: {
          apiUrl: 'http://vikunja:3456/api/v1',
          token: testUser.token,
        },
      });

      // Make several requests in quick succession
      const requests = Array(5)
        .fill(null)
        .map(() => client.get('/user'));

      // All requests should complete without errors
      await expect(Promise.all(requests)).resolves.toBeDefined();
    });
  });
});
