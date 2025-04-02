import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
import { ProjectResource } from '../client/resource/project';
import { VikunjaConfig } from '../config/types';

/**
 * MCP server for exposing Vikunja resources
 */
export class VikunjaMcpServer {
  private readonly server: McpServer;
  private transport?: StdioServerTransport;

  constructor(_config: VikunjaConfig, _projectResource: ProjectResource) {
    // Initialize MCP server
    this.server = new McpServer(
      {
        name: 'vikunja',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {}, // Enable resource capabilities
        },
      }
    );

    // Register Vikunja resources
    this.server.resource(
      'project',
      new ResourceTemplate('vikunja://projects/{id}', {
        list: undefined, // Will implement listing later
      }),
      (uri, vars) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify({
              id: Number(vars.id),
              title: 'Not implemented',
              description: 'Draft implementation',
            }),
          },
        ],
      })
    );
  }

  /**
   * Start the server with stdio transport
   */
  async start(): Promise<void> {
    this.transport = new StdioServerTransport();
    await this.server.server.connect(this.transport);
  }

  /**
   * Stop the server
   */
  stop(): void {
    if (this.transport) {
      this.transport.close().catch((err: Error) => {
        console.error('Error closing transport:', err.message);
      });
      this.transport = undefined;
    }
  }
}
