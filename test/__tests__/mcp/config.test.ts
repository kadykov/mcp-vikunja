import { loadConfig } from '../../../src/mcp/config';

describe('MCP Server Configuration', () => {
  // Store original env vars
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original env vars
    process.env = originalEnv;
  });

  it('should load valid configuration from environment', () => {
    // Set test env vars
    process.env.VIKUNJA_API_URL = 'http://vikunja:3456/api/v1';
    process.env.VIKUNJA_API_TOKEN = 'test-token';

    const config = loadConfig();

    expect(config).toEqual({
      apiUrl: 'http://vikunja:3456/api/v1',
      token: 'test-token',
      rateLimit: {
        maxRequests: 500,
        timeWindow: 60000,
      },
    });
  });

  it('should throw error if VIKUNJA_API_URL is missing', () => {
    // Set only token
    process.env.VIKUNJA_API_TOKEN = 'test-token';

    expect(() => loadConfig()).toThrow(/VIKUNJA_API_URL/);
  });

  it('should throw error if VIKUNJA_API_TOKEN is missing', () => {
    // Set only URL
    process.env.VIKUNJA_API_URL = 'http://vikunja:3456/api/v1';

    expect(() => loadConfig()).toThrow(/VIKUNJA_API_TOKEN/);
  });

  it('should throw error if VIKUNJA_API_URL is invalid', () => {
    // Set invalid URL
    process.env.VIKUNJA_API_URL = 'not-a-url';
    process.env.VIKUNJA_API_TOKEN = 'test-token';

    expect(() => loadConfig()).toThrow(/VIKUNJA_API_URL/);
  });

  it('should use custom rate limit values when provided', () => {
    process.env.VIKUNJA_API_URL = 'http://vikunja:3456/api/v1';
    process.env.VIKUNJA_API_TOKEN = 'test-token';
    process.env.VIKUNJA_API_RATE_LIMIT = '100';
    process.env.VIKUNJA_API_RATE_LIMIT_WINDOW = '30000';

    const config = loadConfig();

    expect(config).toEqual({
      apiUrl: 'http://vikunja:3456/api/v1',
      token: 'test-token',
      rateLimit: {
        maxRequests: 100,
        timeWindow: 30000,
      },
    });
  });

  it('should throw error if VIKUNJA_API_TOKEN is empty', () => {
    // Set empty token
    process.env.VIKUNJA_API_URL = 'http://vikunja:3456/api/v1';
    process.env.VIKUNJA_API_TOKEN = '';

    expect(() => loadConfig()).toThrow(/VIKUNJA_API_TOKEN/);
  });
});
