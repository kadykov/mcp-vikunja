import { setupServer } from 'msw/node';

/**
 * Mock server for intercepting API requests during tests
 */
export const server = setupServer();

/**
 * Setup mock server before all tests
 */
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

/**
 * Reset handlers between tests
 */
afterEach(() => {
  server.resetHandlers();
});

/**
 * Clean up after all tests
 */
afterAll(() => {
  server.close();
});

/**
 * Create a test configuration object
 */
export const createTestConfig = (override = {}) => ({
  apiUrl: 'http://localhost:3456',
  token: 'test-token',
  ...override,
});
