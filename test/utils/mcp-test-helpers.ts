import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { VikunjaHttpClient } from '../../src/client/http/client';
import { ProjectResource, ProjectImpl } from '../../src/client/resource/project';
import { NotFoundError } from '../../src/client/http/errors';

interface McpTestContext {
  client: Client;
  transport: StdioClientTransport;
  cleanup: () => Promise<void>;
}

/**
 * Start MCP server with test configuration
 */
export async function startMcpServer(token: string): Promise<McpTestContext> {
  // Start a new server process and create client with provided token
  let transport: StdioClientTransport | undefined;
  let client: Client | undefined;

  try {
    transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/src/mcp/server.js'],
      env: {
        ...process.env,
        VIKUNJA_API_URL: 'http://vikunja:3456/api/v1',
        VIKUNJA_API_TOKEN: token,
      } as Record<string, string>, // Pass all env vars to child process
      stderr: 'inherit', // Show server errors in test output
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

    // Create cleanup function
    const cleanup = async (): Promise<void> => {
      if (transport) {
        await transport.close();
      }
    };

    return {
      client,
      transport,
      cleanup,
    };
  } catch (error) {
    // Clean up on error
    if (transport) {
      await transport.close();
    }
    throw error;
  }
}

/**
 * Create a test project in Vikunja
 */
export async function createTestProject(token: string, scope: string): Promise<ProjectImpl> {
  const timestamp = Date.now();
  const newProject = {
    title: `Test Project [${scope}] ${timestamp}`,
    description: 'Project created by integration test',
  };

  const client = new VikunjaHttpClient({
    config: {
      apiUrl: 'http://vikunja:3456/api/v1',
      token: token,
    },
  });

  const projectResource = new ProjectResource(client);
  return projectResource.create(newProject);
}

/**
 * Clean up test data created during tests including test projects not tracked in testProjects array
 */
export async function cleanupTestData(token: string, scope: string): Promise<void> {
  const client = new VikunjaHttpClient({
    config: {
      apiUrl: 'http://vikunja:3456/api/v1',
      token: token,
    },
  });

  const projectResource = new ProjectResource(client);

  try {
    // Get all projects
    const projects = await projectResource.list();

    // Clean up any projects that look like test projects
    for (const project of projects) {
      if (project.title.includes(`Test Project [${scope}]`)) {
        try {
          await project.delete();
        } catch (error) {
          if (error instanceof NotFoundError) {
            // Project already deleted, ignore
            continue;
          }
          console.error(`Failed to delete project ${project.id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Failed to clean up test projects:', error);
  }
}
