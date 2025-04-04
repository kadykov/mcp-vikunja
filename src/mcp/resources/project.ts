import {
  ReadResourceCallback,
  ReadResourceTemplateCallback,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { Variables } from '@modelcontextprotocol/sdk/shared/uriTemplate.js';
import { VikunjaHttpClient } from '../../client/http/client.js';
import { ProjectResource } from '../../client/resource/project.js';
import { VikunjaError } from '../../client/http/errors.js';
import { fromMcpUri, toMcpContent } from '../translation/project.js';

/**
 * Create project list resource handler with configured client
 */
export function createProjectListHandler(client: VikunjaHttpClient): ReadResourceCallback {
  const projectResource = new ProjectResource(client);

  return async () => {
    try {
      const projects = await projectResource.list();

      return {
        contents: [
          {
            uri: 'vikunja://projects',
            text: toMcpContent(projects),
          },
        ],
      };
    } catch (error) {
      if (error instanceof VikunjaError) {
        throw new Error(`Vikunja error: ${error.message}`);
      }
      throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };
}

/**
 * Create project resource handler with configured client
 */
export function createProjectHandler(client: VikunjaHttpClient): ReadResourceTemplateCallback {
  // Create project resource using provided client
  const projectResource = new ProjectResource(client);

  return async (uri: URL, _variables: Variables, _extra: Record<string, unknown>) => {
    try {
      // Extract project ID and fetch from Vikunja
      const projectId = fromMcpUri(uri.href);
      const project = await projectResource.get(projectId);

      // Convert to MCP format
      return {
        contents: [
          {
            uri: uri.href,
            text: toMcpContent(project),
          },
        ],
      };
    } catch (error) {
      // Handle known errors
      if (error instanceof VikunjaError) {
        throw new Error(`Vikunja error: ${error.message}`);
      }

      // Handle other errors
      throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };
}
