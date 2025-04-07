import { Task } from '../../types/index.js';
import { TaskMarkdownRenderer } from '../../renderers/markdown/TaskMarkdownRenderer.js';

const taskRenderer = new TaskMarkdownRenderer();

/**
 * Convert Task or Task[] to MCP resource content
 * Uses Markdown format for consistent task representation
 */
export async function toMcpContent(task: Task | Task[]): Promise<string> {
  if (Array.isArray(task)) {
    return taskRenderer.renderList(task);
  }
  return taskRenderer.render(task);
}
