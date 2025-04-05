import {
  escapeMarkdown,
  createLink,
  createListItem,
  createHeading,
  createCodeBlock,
} from '../../../../src/renderers/utils/markdown-helpers';

describe('Markdown Helpers', () => {
  describe('escapeMarkdown', () => {
    it('should escape special markdown characters', () => {
      const input = 'Text with *asterisks*, [brackets], and `backticks`';
      const expected = 'Text with \\*asterisks\\*, \\[brackets\\], and \\`backticks\\`';
      expect(escapeMarkdown(input)).toBe(expected);
    });

    it('should handle multiple special characters together', () => {
      const input = '**_Bold Italic_**';
      const expected = '\\*\\*\\_Bold Italic\\_\\*\\*';
      expect(escapeMarkdown(input)).toBe(expected);
    });

    it('should handle URLs', () => {
      const input = '[Link](http://example.com)';
      const expected = '\\[Link\\]\\(http://example.com\\)';
      expect(escapeMarkdown(input)).toBe(expected);
    });

    it('should not modify regular text', () => {
      const input = 'Regular text without special chars';
      expect(escapeMarkdown(input)).toBe(input);
    });
  });

  describe('createLink', () => {
    it('should create a markdown link', () => {
      expect(createLink('Example', 'http://example.com')).toBe('[Example](http://example.com)');
    });

    it('should escape special characters in link text', () => {
      expect(createLink('Example [with] *chars*', 'http://example.com')).toBe(
        '[Example \\[with\\] \\*chars\\*](http://example.com)'
      );
    });
  });

  describe('createListItem', () => {
    it('should create a list item at root level', () => {
      expect(createListItem('Item')).toBe('- Item');
    });

    it('should create an indented list item', () => {
      expect(createListItem('Nested Item', 2)).toBe('    - Nested Item');
    });
  });

  describe('createHeading', () => {
    it('should create a level 1 heading by default', () => {
      expect(createHeading('Title')).toBe('# Title');
    });

    it('should create headings of different levels', () => {
      expect(createHeading('Title', 2)).toBe('## Title');
      expect(createHeading('Title', 3)).toBe('### Title');
    });
  });

  describe('createCodeBlock', () => {
    it('should create a code block without language', () => {
      expect(createCodeBlock('code')).toBe('```\ncode\n```');
    });

    it('should create a code block with language', () => {
      expect(createCodeBlock('const x = 1;', 'typescript')).toBe(
        '```typescript\nconst x = 1;\n```'
      );
    });
  });
});
