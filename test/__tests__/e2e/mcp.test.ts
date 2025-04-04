import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { Project } from '../../../src/types';
import { startMcpServer, createTestProject } from '../../utils/mcp-test-helpers';
import { server } from '../../mocks/server';

describe('MCP Server E2E', () => {
  // Disable MSW for E2E tests
  beforeAll(() => server.close());
  afterAll(() => server.listen());

  let client: Client;
  let testProject: Project;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    // Extend timeout for E2E tests
    jest.setTimeout(30000);

    try {
      // Start MCP server and create test data
      const context = await startMcpServer();
      client = context.client;
      cleanup = context.cleanup;
      testProject = await createTestProject();
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  });

  afterEach(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  describe('Projects Static Resource', () => {
    it('should list static resource in available resources', async () => {
      const response = await client.listResources();
      expect(response.resources).toContainEqual({
        uri: 'vikunja://projects',
        name: 'projects',
      });
    });

    it('should return list of projects via MCP resource', async () => {
      // Create test projects
      const testProject1 = await createTestProject();
      const testProject2 = await createTestProject();

      const resource = await client.readResource({
        uri: 'vikunja://projects',
      });

      // Verify response format and data
      expect(resource.contents).toHaveLength(1);
      const projects = JSON.parse(resource.contents[0].text as string) as Project[];
      expect(projects).toContainEqual(
        expect.objectContaining({
          id: testProject1.id,
          title: testProject1.title,
        })
      );
      expect(projects).toContainEqual(
        expect.objectContaining({
          id: testProject2.id,
          title: testProject2.title,
        })
      );
    });
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
    it('should return real project data via MCP resource', async () => {
      const resource = await client.readResource({
        uri: `vikunja://projects/${testProject.id}`,
      });

      expect(resource.contents).toHaveLength(1);
      const content = JSON.parse(resource.contents[0].text as string) as Project;

      // Verify the project data matches
      expect(content.id).toBe(testProject.id);
      expect(content.title).toBe(testProject.title);
      expect(content.description).toBe(testProject.description);
    });

    it('should handle non-existent project', async () => {
      const nonExistentId = 999999;
      await expect(
        client.readResource({
          uri: `vikunja://projects/${nonExistentId}`,
        })
      ).rejects.toThrow();
    });

    it('should handle invalid project URI', async () => {
      await expect(
        client.readResource({
          uri: 'vikunja://projects/invalid',
        })
      ).rejects.toThrow('Invalid MCP project URI format');
    });

    it('should handle malformed project URI', async () => {
      await expect(
        client.readResource({
          uri: 'vikunja://invalid/123',
        })
      ).rejects.toThrow();
    });
  });
});
