import { server } from './mocks/server';
import { handlers } from './mocks/handlers';
import { createProject, createTask, createComment, createUser } from './mocks/factories';

export { server, handlers };

// Export factory functions
export const factories = {
  project: createProject,
  task: createTask,
  comment: createComment,
  user: createUser,
};

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
  // Listen on all requests, but bypass Vikunja API requests and error on other unhandled ones
  server.listen({
    onUnhandledRequest: req => {
      if (req.url.toString().includes('vikunja:3456')) {
        return 'bypass';
      }
      return 'error';
    },
  });
});

afterEach(() => {
  // Reset handlers between tests for clean state
  server.resetHandlers();
});

afterAll(() => {
  // Clean up
  server.close();
});
