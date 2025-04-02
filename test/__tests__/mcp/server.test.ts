import { VikunjaHttpClient } from '../../../src/client/http/client';
import { ProjectResource } from '../../../src/client/resource/project';
import { createTestConfig } from '../../setup';
import { VikunjaMcpServer } from '../../../src/mcp/server';

describe('VikunjaMcpServer', () => {
  it('should create MCP server with Vikunja resources', () => {
    // Create test dependencies
    const httpClient = new VikunjaHttpClient({
      config: { apiUrl: 'http://localhost:3456', token: 'test-token' },
    });
    const projectResource = new ProjectResource(httpClient);

    // Create server - should not throw
    const mcpServer = new VikunjaMcpServer(createTestConfig(), projectResource);
    expect(mcpServer).toBeDefined();
  });

  it('should start and stop without errors', async () => {
    // Create server
    const httpClient = new VikunjaHttpClient({
      config: { apiUrl: 'http://localhost:3456', token: 'test-token' },
    });
    const projectResource = new ProjectResource(httpClient);
    const mcpServer = new VikunjaMcpServer(createTestConfig(), projectResource);

    // Start server - should not throw
    await expect(mcpServer.start()).resolves.not.toThrow();

    // Stop server - should not throw
    expect(() => mcpServer.stop()).not.toThrow();
  });
});
