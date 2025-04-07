import { BaseMarkdownRenderer } from '../../../../src/renderers/markdown/BaseMarkdownRenderer';

// Test implementation of BaseMarkdownRenderer
class TestRenderer extends BaseMarkdownRenderer<string> {
  render(data: string): Promise<string> {
    return Promise.resolve(data);
  }

  renderAsListItem(item: string): Promise<string> {
    return Promise.resolve(`- ${item}`);
  }
}

describe('BaseMarkdownRenderer', () => {
  const renderer = new TestRenderer();

  describe('renderList', () => {
    it('should render items as a markdown list using renderAsListItem', async () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      const expected = '- Item 1\n- Item 2\n- Item 3';

      expect(await renderer.renderList(items)).toBe(expected);
    });

    it('should handle empty list', async () => {
      expect(await renderer.renderList([])).toBe('');
    });

    it('should handle single item list', async () => {
      expect(await renderer.renderList(['Single Item'])).toBe('- Single Item');
    });
  });
});
