import { IMarkdownRenderer } from '../interfaces/IMarkdownRenderer.js';

/**
 * Base implementation of markdown renderer
 */
export abstract class BaseMarkdownRenderer<T> implements IMarkdownRenderer<T> {
  abstract render(data: T): string;

  /**
   * Default implementation for rendering lists
   * Uses renderAsListItem for each item
   */
  renderList(items: T[]): string {
    return items.map(item => this.renderAsListItem(item)).join('\n');
  }

  abstract renderAsListItem(item: T): string;
}
