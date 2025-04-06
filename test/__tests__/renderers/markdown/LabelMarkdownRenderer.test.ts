import { LabelMarkdownRenderer } from '../../../../src/renderers/markdown/LabelMarkdownRenderer';
import { createLabel } from '../../../mocks/factories/label';

describe('LabelMarkdownRenderer', () => {
  const renderer = new LabelMarkdownRenderer();

  const mockLabel = createLabel({
    id: 1,
    title: 'Test Label',
    description: 'A test label',
  });

  const mockLabels = [
    createLabel({ id: 1, title: 'Label 1' }),
    createLabel({ id: 2, title: 'Label 2' }),
    createLabel({ id: 3, title: 'Label with [special] *chars*' }),
    createLabel({ id: 4, title: '  #existing hash  ' }),
    createLabel({ id: 5, title: 'Multiple   Spaces Here' }),
  ];

  describe('renderAsHashtag', () => {
    it('should render a label as a hashtag', () => {
      const result = renderer.renderAsHashtag(mockLabel);
      expect(result).toBe('#test-label');
    });

    it('should handle special characters and spaces', () => {
      expect(renderer.renderAsHashtag(mockLabels[2])).toBe('#label-with-special-chars');
    });

    it('should handle existing hashes', () => {
      expect(renderer.renderAsHashtag(mockLabels[3])).toBe('#existing-hash');
    });

    it('should normalize multiple spaces', () => {
      expect(renderer.renderAsHashtag(mockLabels[4])).toBe('#multiple-spaces-here');
    });
  });

  describe('render', () => {
    it('should render a label with description', () => {
      const result = renderer.render(mockLabel);
      expect(result).toBe('#test-label - A test label');
    });

    it('should render a label without description', () => {
      const labelWithoutDesc = createLabel({
        id: 6,
        title: 'No Description',
        description: undefined,
      });
      const result = renderer.render(labelWithoutDesc);
      expect(result).toBe('#no-description');
    });
  });

  describe('renderAsListItem', () => {
    it('should render a label as a list item', () => {
      const result = renderer.renderAsListItem(mockLabel);
      expect(result).toBe('- #test-label');
    });
  });

  describe('renderList', () => {
    it('should render multiple labels as a markdown list', () => {
      const simpleLabels = [
        createLabel({ id: 1, title: 'One' }),
        createLabel({ id: 2, title: 'Two' }),
      ];
      const result = renderer.renderList(simpleLabels);
      expect(result).toBe('- #one\n- #two');
    });

    it('should handle empty list', () => {
      const result = renderer.renderList([]);
      expect(result).toBe('');
    });
  });
});
