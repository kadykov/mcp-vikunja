import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { VikunjaHttpClient } from '../client/http/client.js';
import { loadConfig } from './config.js';
import { createResourceHandler } from './resources/index.js';
import { uriTemplate } from './uri.js';

// Load configuration first - will throw if invalid
const config = loadConfig();

// Create shared HTTP client instance
export const client = new VikunjaHttpClient({ config });

// Initialize MCP server
const server = new McpServer(
  {
    name: 'vikunja',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {
        list: false, // We don't support listing yet
        read: true, // Enable reading resources
        complete: true, // Enable resource type completion
      },
    },
  }
);

// Register Vikunja resource handler
server.resource(
  'vikunja',
  new ResourceTemplate(uriTemplate.toString(), {
    list: undefined,
    complete: {
      resource: (): string[] => ['projects', 'tasks'],
    },
  }),
  createResourceHandler(client)
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
