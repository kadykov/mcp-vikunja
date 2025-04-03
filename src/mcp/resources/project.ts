import { ReadResourceTemplateCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Variables } from '@modelcontextprotocol/sdk/shared/uriTemplate.js';
import { ProjectResource } from '../../client/resource/project.js';
import { VikunjaError } from '../../client/http/errors.js';
import { fromMcpUri, toMcpContent } from '../translation/project.js';
import { client } from '../server.js';

// Create project resource using shared client
const projectResource = new ProjectResource(client);

/**
 * Handle project resource requests
 * Uses translation layer to convert between MCP and Vikunja formats
 */
export const handleProjectResource: ReadResourceTemplateCallback = async (
  uri: URL,
  _variables: Variables,
  _extra: Record<string, unknown>
) => {
  try {
    // Extract project ID and fetch from Vikunja
    const projectId = fromMcpUri(uri.href);
    const project = await projectResource.get(projectId);

    // Convert to MCP format
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
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
