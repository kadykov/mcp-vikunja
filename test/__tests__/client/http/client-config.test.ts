import { VikunjaHttpClient } from '../../../../src/client/http/client';
import { VikunjaConfig } from '../../../../src/config/types';

describe('VikunjaHttpClient Configuration', () => {
  const testConfig: VikunjaConfig = {
    apiUrl: 'http://vikunja:3456/api/v1',
    token: 'test-token',
  };

  it('should initialize with given config', () => {
    const client = new VikunjaHttpClient({ config: testConfig });
    expect(client.config).toEqual(testConfig);
  });

  it('should remove trailing slash from API URL', () => {
    const configWithSlash: VikunjaConfig = {
      ...testConfig,
      apiUrl: 'http://vikunja:3456/api/v1/',
    };

    const client = new VikunjaHttpClient({ config: configWithSlash });
    expect(client.config.apiUrl).toBe('http://vikunja:3456/api/v1');
  });

  it('should update token through config setter', () => {
    const client = new VikunjaHttpClient({ config: testConfig });

    // Update token
    const newConfig = {
      ...testConfig,
      token: 'new-test-token',
    };
    client.config = newConfig;

    expect(client.config.token).toBe('new-test-token');
    expect(client.config.apiUrl).toBe(testConfig.apiUrl); // URL stays the same
  });
});
