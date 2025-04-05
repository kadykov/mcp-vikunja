import { Project } from '../../types/index.js';
import { BaseMarkdownRenderer } from './BaseMarkdownRenderer.js';
import { toMcpUri } from '../../mcp/translation/project.js';

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
   * @throws Error if project.id is undefined
   */
  renderAsListItem(project: Project): string {
    if (project.id === undefined) {
      throw new Error('Cannot render project without ID');
    }
    return `- [${project.title}](${toMcpUri(project.id)})`;
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
