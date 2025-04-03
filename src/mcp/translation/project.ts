import { Project } from '../../types';

/**
 * Convert Vikunja project ID to MCP URI
 */
export function toMcpUri(id: number): string {
  return `vikunja://projects/${id}`;
}

/**
 * Convert MCP URI to Vikunja project ID
 */
export function fromMcpUri(uri: string): number {
  const match = uri.match(/^vikunja:\/\/projects\/(\d+)$/);
  if (!match) {
    throw new Error('Invalid MCP project URI format');
  }
  return Number(match[1]);
}

/**
 * Convert Project to MCP resource content
 * Initially using direct JSON serialization
 * Will be updated to use Markdown format in the future
 */
export function toMcpContent(project: Project): string {
  return JSON.stringify(project, null, 2);
}
