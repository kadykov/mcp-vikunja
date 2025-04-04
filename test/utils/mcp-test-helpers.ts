import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { Project } from '../../src/types';
import { VikunjaHttpClient } from '../../src/client/http/client';
import { ProjectResource } from '../../src/client/resource/project';
import { NotFoundError } from '../../src/client/http/errors';
import { createTestUser } from './vikunja-test-helpers';

interface McpTestContext {
  client: Client;
  transport: StdioClientTransport;
  cleanup: () => Promise<void>;
  testUser: {
    token: string;
    credentials: {
      username: string;
      email: string;
      password: string;
    };
  };
}

interface TestProject extends Project {
  /** Indicates this is a test project that should be cleaned up */
  _isTest?: boolean;
}

let testProjects: TestProject[] = [];

/**
 * Start MCP server with test configuration
 */
export async function startMcpServer(): Promise<McpTestContext> {
  // Create test user
  const testUser = await createTestUser();

  // Store original env vars
  const originalEnv = {
    VIKUNJA_API_URL: process.env.VIKUNJA_API_URL,
    VIKUNJA_API_TOKEN: process.env.VIKUNJA_API_TOKEN,
  };

  // Set environment variables
  process.env.VIKUNJA_API_URL = 'http://vikunja:3456/api/v1';
  process.env.VIKUNJA_API_TOKEN = testUser.token;

  // Start a new server process and create client
  let transport: StdioClientTransport | undefined;
  let client: Client | undefined;

  try {
    transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/src/mcp/server.js'],
      env: process.env as Record<string, string>, // Pass all env vars to child process
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
      // Restore original env vars
      process.env.VIKUNJA_API_URL = originalEnv.VIKUNJA_API_URL;
      process.env.VIKUNJA_API_TOKEN = originalEnv.VIKUNJA_API_TOKEN;
      // Clean up test data
      await cleanupTestData();
    };

    return {
      client,
      transport,
      cleanup,
      testUser,
    };
  } catch (error) {
    // Clean up on error
    if (transport) {
      await transport.close();
    }
    process.env.VIKUNJA_API_URL = originalEnv.VIKUNJA_API_URL;
    process.env.VIKUNJA_API_TOKEN = originalEnv.VIKUNJA_API_TOKEN;
    throw error;
  }
}

/**
 * Create a test project in Vikunja
 */
export async function createTestProject(): Promise<TestProject> {
  const timestamp = Date.now();
  const newProject = {
    title: `MCP Test Project ${timestamp}`,
    description: 'Project created by MCP E2E tests',
  };

  const client = new VikunjaHttpClient({
    config: {
      apiUrl: process.env.VIKUNJA_API_URL!,
      token: process.env.VIKUNJA_API_TOKEN!,
    },
  });

  const projectResource = new ProjectResource(client);
  const project = await projectResource.create(newProject);

  const testProject: TestProject = {
    ...project,
    _isTest: true,
  };

  testProjects.push(testProject);
  return testProject;
}

/**
 * Clean up test data created during tests
 */
async function cleanupTestData(): Promise<void> {
  if (testProjects.length === 0) return;

  const client = new VikunjaHttpClient({
    config: {
      apiUrl: process.env.VIKUNJA_API_URL!,
      token: process.env.VIKUNJA_API_TOKEN!,
    },
  });

  const projectResource = new ProjectResource(client);

  // Clean up projects sequentially
  for (const project of testProjects) {
    if (typeof project.id !== 'number') continue;

    try {
      await projectResource.delete(project.id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        // Project already deleted, ignore
        continue;
      }
    }
  }

  // Reset test projects array
  testProjects = [];
}
