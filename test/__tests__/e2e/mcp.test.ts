import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { Project } from '../../../src/types';
import { startMcpServer, createTestProject, cleanupTestData } from '../../utils/mcp-test-helpers';
import { server } from '../../mocks/server';
import { createTestUser } from '../../utils/vikunja-test-helpers';
import { toMcpUri } from '../../../src/mcp/utils/uri';
import { escapeMarkdown } from '../../../src/renderers/utils/markdown-helpers';

describe('MCP Server E2E', () => {
  // Disable MSW for E2E tests
  beforeAll(() => server.close());
  afterAll(() => server.listen());

  let client: Client;
  let testProject: Project;
  let cleanup: () => Promise<void>;
  let testToken: string;

  beforeEach(async () => {
    // Extend timeout for E2E tests
    jest.setTimeout(30000);

    try {
      // Create test user and start MCP server
      const testUser = await createTestUser();
      testToken = testUser.token;

      const context = await startMcpServer(testToken);
      client = context.client;
      cleanup = context.cleanup;

      // Create test data
      testProject = await createTestProject(testToken, 'mcp-e2e');
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  });

  afterEach(async () => {
    try {
      // Clean up test projects first
      await cleanupTestData(testToken, 'mcp-e2e');
      // Then close MCP server
      if (cleanup) {
        await cleanup();
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
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

    it('should return list of projects via MCP resource as Markdown', async () => {
      // Create test projects
      const testProject1 = await createTestProject(testToken, 'mcp-e2e');
      const testProject2 = await createTestProject(testToken, 'mcp-e2e');

      const resource = await client.readResource({
        uri: 'vikunja://projects',
      });

      // Verify response format and data
      expect(resource.contents).toHaveLength(1);
      const content = resource.contents[0].text as string;

      // Check that it contains Markdown links to both projects with escaped characters
      expect(content).toContain(
        `- [${escapeMarkdown(testProject1.title)}](${toMcpUri(testProject1.id)})`
      );
      expect(content).toContain(
        `- [${escapeMarkdown(testProject2.title)}](${toMcpUri(testProject2.id)})`
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
      const content = resource.contents[0].text as string;

      // Verify the project markdown contains expected content
      expect(content).toContain(`# ${escapeMarkdown(testProject.title)}`);
      if (testProject.description) {
        expect(content).toContain(testProject.description);
      }
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
