/**
 * Convert Vikunja project ID to MCP URI
 */
export function toMcpUri(id: number): string {
  return `vikunja://projects/${id}`;
}

/**
 * Convert MCP URI to Vikunja project ID
 */
export function fromMcpUri(uri: string): number {
  const match = uri.match(/^vikunja:\/\/projects\/(\d+)$/);
  if (!match) {
    throw new Error('Invalid MCP project URI format');
  }
  return Number(match[1]);
}
