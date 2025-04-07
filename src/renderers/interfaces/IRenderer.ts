/**
 * Base renderer interface
 */
export interface IRenderer<T> {
  /**
   * Render a single item
   */
  render(data: T): Promise<string>;

  /**
   * Render a list of items
   */
  renderList(items: T[]): Promise<string>;
}
