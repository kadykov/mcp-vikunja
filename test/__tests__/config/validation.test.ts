import { validateConfig } from '../../../src/config';
import { createTestConfig } from '../../setup';

describe('Configuration Validation', () => {
  it('accepts valid configuration', async () => {
    const config = createTestConfig();
    await expect(validateConfig(config)).resolves.toEqual(config);
  });

  it('accepts configuration with rate limiting', async () => {
    const config = createTestConfig({
      rateLimit: {
        maxRequests: 100,
        timeWindow: 60000,
      },
    });
    await expect(validateConfig(config)).resolves.toEqual(config);
  });

  it('rejects empty API URL', async () => {
    const config = createTestConfig({ apiUrl: '' });
    await expect(validateConfig(config)).rejects.toThrow('API URL');
  });

  it('rejects invalid API URL', async () => {
    const config = createTestConfig({ apiUrl: 'not-a-url' });
    await expect(validateConfig(config)).rejects.toThrow('URL');
  });

  it('rejects empty token', async () => {
    const config = createTestConfig({ token: '' });
    await expect(validateConfig(config)).rejects.toThrow('Token');
  });

  it('rejects negative maxRequests in rate limit', async () => {
    const config = createTestConfig({
      rateLimit: {
        maxRequests: -1,
        timeWindow: 60000,
      },
    });
    await expect(validateConfig(config)).rejects.toThrow('Maximum requests');
  });

  it('rejects negative timeWindow in rate limit', async () => {
    const config = createTestConfig({
      rateLimit: {
        maxRequests: 100,
        timeWindow: -1,
      },
    });
    await expect(validateConfig(config)).rejects.toThrow('Time window');
  });

  it('includes field name in validation error', async () => {
    const config = createTestConfig({ apiUrl: 'invalid' });
    const validationPromise = validateConfig(config);
    await expect(validationPromise).rejects.toThrow();
    await expect(validationPromise).rejects.toHaveProperty(
      'message',
      expect.stringContaining('apiUrl')
    );
  });
});
