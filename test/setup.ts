import { server } from './mocks/server';
import { handlers } from './mocks/handlers';

export { server, handlers };

// Test configuration
export const TEST_API_URL = 'http://localhost:3456';
export const TEST_API_TOKEN = 'test-token';

interface ConfigOverride {
  apiUrl?: string;
  token?: string;
  rateLimit?: {
    maxRequests: number;
    timeWindow: number;
  };
}

export const createTestConfig = (
  override: ConfigOverride = {}
): {
  apiUrl: string;
  token: string;
} => ({
  apiUrl: TEST_API_URL,
  token: TEST_API_TOKEN,
  ...override,
});

// Setup MSW
beforeAll(() => {
  // Listen on all requests, error on unhandled ones
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  // Reset handlers between tests for clean state
  server.resetHandlers();
});

afterAll(() => {
  // Clean up
  server.close();
});
