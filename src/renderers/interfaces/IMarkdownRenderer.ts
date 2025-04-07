import { IRenderer } from './IRenderer.js';

/**
 * Markdown-specific renderer interface
 */
export interface IMarkdownRenderer<T> extends IRenderer<T> {
  /**
   * Render an item as a markdown list item
   */
  renderAsListItem(item: T): Promise<string>;

  /**
   * Render an item as a markdown tree (optional)
   * Useful for hierarchical data like nested projects or tasks
   */
  renderAsTree?(item: T): Promise<string>;
}
