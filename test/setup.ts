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

export const createTestConfig = (override = {}) => ({
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
