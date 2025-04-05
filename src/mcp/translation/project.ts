import { Project } from '../../types';
import { ProjectMarkdownRenderer } from '../../renderers/markdown/ProjectMarkdownRenderer.js';

const projectRenderer = new ProjectMarkdownRenderer();

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
 * Convert Project or Project[] to MCP resource content
 * Uses Markdown format for lists and JSON for single projects
 */
export function toMcpContent(project: Project | Project[]): string {
  if (Array.isArray(project)) {
    return projectRenderer.renderList(project);
  }
  return projectRenderer.render(project);
}
