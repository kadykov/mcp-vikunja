import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

describe('MCP Server E2E', () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeEach(async () => {
    // Start a new server process and connect to it
    transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/src/mcp/server.js'],
    });

    client = new Client(
      {
        name: 'test-client',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {}, // Enable resource capabilities for testing
        },
      }
    );
    await client.connect(transport);
  });

  afterEach(async () => {
    await transport.close();
  });

  describe('Project Resource Template', () => {
    it('should list project in available resource templates', async () => {
      const response = await client.listResourceTemplates();
      expect(response.resourceTemplates).toHaveLength(1);
      expect(response.resourceTemplates[0].name).toBe('project');
      expect(response.resourceTemplates[0].uriTemplate).toBe('vikunja://projects/{id}');
    });
  });

  describe('Project Resource Reading', () => {
    it('should return project data via MCP resource', async () => {
      const projectId = 1;
      const resource = await client.readResource({
        uri: `vikunja://projects/${projectId}`,
      });

      expect(resource.contents).toHaveLength(1);
      interface ProjectResponse {
        id: number;
        title: string;
        description: string;
      }

      const content = JSON.parse(resource.contents[0].text as string) as ProjectResponse;

      expect(content).toStrictEqual({
        id: projectId,
        title: 'Not implemented',
        description: 'Draft implementation',
      });
    });
  });
});
