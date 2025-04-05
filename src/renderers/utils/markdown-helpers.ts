/**
 * Common markdown formatting utilities
 */

/**
 * Escape markdown special characters in text
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/[*_`[\]()#>]/g, '\\$&');
}

/**
 * Create a markdown link
 */
export function createLink(text: string, url: string): string {
  return `[${escapeMarkdown(text)}](${url})`;
}

/**
 * Create a markdown list item
 */
export function createListItem(text: string, level = 0): string {
  const indent = '  '.repeat(level);
  return `${indent}- ${text}`;
}

/**
 * Create a markdown heading
 */
export function createHeading(text: string, level = 1): string {
  return `${'#'.repeat(level)} ${text}`;
}

/**
 * Create a markdown code block
 */
export function createCodeBlock(text: string, language = ''): string {
  return `\`\`\`${language}\n${text}\n\`\`\``;
}
