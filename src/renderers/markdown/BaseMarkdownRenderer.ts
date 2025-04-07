import { IMarkdownRenderer } from '../interfaces/IMarkdownRenderer.js';

/**
 * Base implementation of markdown renderer
 */
export abstract class BaseMarkdownRenderer<T> implements IMarkdownRenderer<T> {
  abstract render(data: T): Promise<string>;

  /**
   * Default implementation for rendering lists
   * Uses renderAsListItem for each item
   */
  async renderList(items: T[]): Promise<string> {
    const renderedItems = await Promise.all(items.map(item => this.renderAsListItem(item)));
    return renderedItems.join('\n');
  }

  abstract renderAsListItem(item: T): Promise<string>;
}
