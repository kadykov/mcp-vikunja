import { loadConfig } from '../../../src/mcp/config';

describe('MCP Server Configuration', () => {
  // Store original values of relevant env vars
  const originalApiUrl = process.env.VIKUNJA_API_URL;
  const originalApiToken = process.env.VIKUNJA_API_TOKEN;
  const originalRateLimit = process.env.VIKUNJA_API_RATE_LIMIT;
  const originalRateLimitWindow = process.env.VIKUNJA_API_RATE_LIMIT_WINDOW;

  beforeEach(() => {
    // Delete relevant env vars before each test
    delete process.env.VIKUNJA_API_URL;
    delete process.env.VIKUNJA_API_TOKEN;
    delete process.env.VIKUNJA_API_RATE_LIMIT;
    delete process.env.VIKUNJA_API_RATE_LIMIT_WINDOW;
  });

  afterAll(() => {
    // Restore original env vars
    // (Set back to original value or undefined if it wasn't set initially)
    process.env.VIKUNJA_API_URL = originalApiUrl;
    process.env.VIKUNJA_API_TOKEN = originalApiToken;
    process.env.VIKUNJA_API_RATE_LIMIT = originalRateLimit;
    process.env.VIKUNJA_API_RATE_LIMIT_WINDOW = originalRateLimitWindow;

    // Clean up undefined properties explicitly if they were originally undefined
    if (originalApiUrl === undefined) delete process.env.VIKUNJA_API_URL;
    if (originalApiToken === undefined) delete process.env.VIKUNJA_API_TOKEN;
    if (originalRateLimit === undefined) delete process.env.VIKUNJA_API_RATE_LIMIT;
    if (originalRateLimitWindow === undefined) delete process.env.VIKUNJA_API_RATE_LIMIT_WINDOW;
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
    // Set only token (URL is deleted in beforeEach)
    process.env.VIKUNJA_API_TOKEN = 'test-token';

    expect(() => loadConfig()).toThrow(/VIKUNJA_API_URL/);
  });

  it('should throw error if VIKUNJA_API_TOKEN is missing', () => {
    // Set only URL (Token is deleted in beforeEach)
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
