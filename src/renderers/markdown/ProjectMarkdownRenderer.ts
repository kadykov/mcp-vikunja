import { Project } from '../../types/index.js';
import { BaseMarkdownRenderer } from './BaseMarkdownRenderer.js';
import { toMcpUri } from '../../mcp/utils/uri.js';
import { createLink, createListItem, escapeMarkdown } from '../utils/markdown-helpers.js';

/**
 * Markdown renderer for Project entities
 */
export class ProjectMarkdownRenderer extends BaseMarkdownRenderer<Project> {
  /**
   * Render a single project in detail
   */
  render(project: Project): string {
    return JSON.stringify(project, null, 2); // For now, keep JSON for single projects
  }

  /**
   * Render a project as a markdown list item with a link
   */
  renderAsListItem(project: Project): string {
    const title = project.title ?? 'Untitled Project';
    const projectLink = createLink(escapeMarkdown(title), toMcpUri(project.id));
    return createListItem(projectLink);
  }

  /**
   * Optional tree rendering for hierarchical project views
   * To be implemented in the future
   */
  renderAsTree(project: Project): string {
    // Future implementation for hierarchical views
    return this.renderAsListItem(project);
  }
}
