import { Project } from '../../types/index.js';
import { ProjectMarkdownRenderer } from '../../renderers/markdown/ProjectMarkdownRenderer.js';

const projectRenderer = new ProjectMarkdownRenderer();

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
