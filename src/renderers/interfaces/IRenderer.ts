/**
 * Base renderer interface
 */
export interface IRenderer<T> {
  /**
   * Render a single item
   */
  render(data: T): string;

  /**
   * Render a list of items
   */
  renderList(items: T[]): string;
}
