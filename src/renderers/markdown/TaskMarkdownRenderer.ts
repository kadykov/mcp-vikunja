import { Task } from '../../types/index.js';
import { BaseMarkdownRenderer } from './BaseMarkdownRenderer.js';
import { LabelMarkdownRenderer } from './LabelMarkdownRenderer.js';
import { toMcpUri } from '../../mcp/utils/uri.js';
import { createLink, createHeading, escapeMarkdown } from '../utils/markdown-helpers.js';

/**
 * Markdown renderer for Task entities
 */
export class TaskMarkdownRenderer extends BaseMarkdownRenderer<Task> {
  private labelRenderer: LabelMarkdownRenderer;

  constructor() {
    super();
    this.labelRenderer = new LabelMarkdownRenderer();
  }

  /**
   * Render a task as a markdown list item
   * Format: - [x] [Task Title](uri) #label1 #label2
   */
  renderAsListItem(task: Task): Promise<string> {
    const checkbox = task.done ? '[x]' : '[ ]';
    const taskLink = createLink(escapeMarkdown(task.title), toMcpUri(task.id));
    const labels = task.labels?.length
      ? ' ' + task.labels.map(label => this.labelRenderer.renderAsHashtag(label)).join(' ')
      : '';

    return Promise.resolve(`- ${checkbox} ${taskLink}${labels}`);
  }

  /**
   * Render a task with full details in markdown
   */
  render(task: Task): Promise<string> {
    const parts: string[] = [
      createHeading(escapeMarkdown(task.title), 1),
      `- ${task.done ? '[x]' : '[ ]'} ${task.due_date ? `Due: ${task.due_date}` : 'No due date'}`,
    ];

    if (task.description?.trim()) {
      parts.push('', task.description.trim());
    }

    if (task.percent_done && task.percent_done > 0) {
      parts.push('', `Progress: ${task.percent_done}%`);
    }

    if (task.labels?.length) {
      const labels = task.labels.map(label => this.labelRenderer.renderAsHashtag(label)).join(' ');
      parts.push('', labels);
    }

    if (task.assignees?.length) {
      const assignees = task.assignees.map(user => `@${user.username}`).join(', ');
      parts.push('', `Assigned to: ${assignees}`);
    }

    return Promise.resolve(parts.join('\n'));
  }
}
