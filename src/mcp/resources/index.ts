import { ReadResourceTemplateCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Variables } from '@modelcontextprotocol/sdk/shared/uriTemplate.js';
import { VikunjaHttpClient } from '../../client/http/client.js';
import { ProjectResource } from '../../client/resource/project.js';
import { TaskResource } from '../../client/resource/task.js';
import { ProjectMarkdownRenderer } from '../../renderers/markdown/ProjectMarkdownRenderer.js';
import { TaskMarkdownRenderer } from '../../renderers/markdown/TaskMarkdownRenderer.js';
import { VikunjaError } from '../../client/http/errors.js';
import { ResourceType } from '../uri.js';

// Shared renderers
const projectRenderer = new ProjectMarkdownRenderer();
const taskRenderer = new TaskMarkdownRenderer();

/**
 * Create unified resource handler for both projects and tasks
 */
export function createResourceHandler(client: VikunjaHttpClient): ReadResourceTemplateCallback {
  const projectResource = new ProjectResource(client);
  const taskResource = new TaskResource(client);

  return async (uri: URL, variables: Variables) => {
    const resourceValue = Array.isArray(variables.resource)
      ? variables.resource[0]
      : variables.resource;

    if (!isResourceType(resourceValue)) {
      throw new Error(`Invalid resource type: ${resourceValue}`);
    }

    // TODO: Implement support for multiple IDs
    // For now, just use the first ID if an array is provided
    const id = Array.isArray(variables.id) ? variables.id[0] : variables.id;

    try {
      if (resourceValue === 'projects') {
        const project = await projectResource.get(Number(id));
        return {
          contents: [
            {
              uri: uri.href,
              text: await projectRenderer.render(project),
            },
          ],
        };
      } else {
        const task = await taskResource.get(Number(id));
        return {
          contents: [
            {
              uri: uri.href,
              text: await taskRenderer.render(task),
            },
          ],
        };
      }
    } catch (error) {
      if (error instanceof VikunjaError) {
        throw new Error(`Vikunja error: ${error.message}`);
      }
      throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };
}

/**
 * Type guard for resource type validation
 */
function isResourceType(value: string): value is ResourceType {
  return value === 'projects' || value === 'tasks';
}
