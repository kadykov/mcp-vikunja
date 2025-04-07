import { Project } from '../../types/index.js';
import { BaseMarkdownRenderer } from './BaseMarkdownRenderer.js';
import { TaskMarkdownRenderer } from './TaskMarkdownRenderer.js';
import { createUri } from '../../mcp/uri.js';
import {
  createLink,
  createListItem,
  createHeading,
  escapeMarkdown,
} from '../utils/markdown-helpers.js';

/**
 * Markdown renderer for Project entities
 */
export class ProjectMarkdownRenderer extends BaseMarkdownRenderer<Project> {
  private taskRenderer: TaskMarkdownRenderer;

  constructor() {
    super();
    this.taskRenderer = new TaskMarkdownRenderer();
  }

  /**
   * Render a single project in detail
   */
  async render(project: Project): Promise<string> {
    const parts: string[] = [createHeading(escapeMarkdown(project.title), 1)];

    // Add archived status if project is archived
    if (project.is_archived) {
      parts.push('(ARCHIVED)');
    }

    // Add parent project link if exists
    if (project.parent_project_id) {
      parts.push(createLink('Parent Project', createUri('projects', project.parent_project_id)));
    }

    // Add description if available
    if (project.description?.trim()) {
      parts.push('', project.description.trim());
    }

    // Add tasks section
    const tasks = await project.listTasks();
    if (tasks.length > 0) {
      parts.push('', createHeading('Tasks', 2));
      const renderedTasks = await this.taskRenderer.renderList(tasks);
      parts.push(renderedTasks);
    }

    return parts.join('\n');
  }

  /**
   * Render a project as a markdown list item with a link
   */
  renderAsListItem(project: Project): Promise<string> {
    const archivedPrefix = project.is_archived ? '(ARCHIVED) ' : '';
    const projectLink = createLink(
      escapeMarkdown(project.title),
      createUri('projects', project.id)
    );
    return Promise.resolve(createListItem(archivedPrefix + projectLink));
  }
}
