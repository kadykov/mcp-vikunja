import { UriTemplate } from '@modelcontextprotocol/sdk/shared/uriTemplate.js';

/**
 * Valid Vikunja MCP resource types
 */
export type ResourceType = 'projects' | 'tasks';

/**
 * URI template for Vikunja MCP resources
 * Used by resource handlers for MCP SDK integration
 */
export const uriTemplate = new UriTemplate('vikunja://{resource}/{id}');

/**
 * Creates a Vikunja MCP URI for a resource
 */
export function createUri(resource: ResourceType, id: number): string {
  return uriTemplate.expand({ resource, id: String(id) });
}
