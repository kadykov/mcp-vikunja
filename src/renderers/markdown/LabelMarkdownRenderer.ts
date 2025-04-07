import { Label } from '../../types/index.js';
import { BaseMarkdownRenderer } from './BaseMarkdownRenderer.js';

/**
 * Markdown renderer for Label entities
 */
export class LabelMarkdownRenderer extends BaseMarkdownRenderer<Label> {
  /**
   * Render a label as a hashtag
   */
  renderAsHashtag(label: Label): string {
    const sanitized = this.sanitizeLabelText(label.title);
    return `#${sanitized}`;
  }

  /**
   * Render a label with full details
   */
  render(label: Label): Promise<string> {
    const hashtag = this.renderAsHashtag(label);
    if (label.description) {
      return Promise.resolve(`${hashtag} - ${label.description}`);
    }
    return Promise.resolve(hashtag);
  }

  /**
   * Render a label as a list item
   * This is mainly for consistency with the BaseMarkdownRenderer interface
   */
  renderAsListItem(label: Label): Promise<string> {
    return Promise.resolve(`- ${this.renderAsHashtag(label)}`);
  }

  /**
   * Sanitize label text for use as a hashtag
   * - Removes leading hashes
   * - Replaces spaces with hyphens
   * - Makes lowercase for consistency
   */
  private sanitizeLabelText(text: string): string {
    return text
      .trim()
      .replace(/^#+/, '') // Remove leading hashes
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase();
  }
}
