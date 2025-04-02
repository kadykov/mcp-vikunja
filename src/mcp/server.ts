import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { handleProjectResource } from './resources/project.js';

// Initialize MCP server
// Create server with resource capabilities
const server = new McpServer(
  {
    name: 'vikunja',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {
        list: true, // Enable listing of resources
        read: true, // Enable reading resources
        complete: false, // We don't support completion yet
      },
    },
  }
);

// Register Vikunja resources
server.resource(
  'project',
  new ResourceTemplate('vikunja://projects/{id}', {
    list: undefined, // Will implement listing later
  }),
  handleProjectResource
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
