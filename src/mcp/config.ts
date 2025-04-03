import { z } from 'zod';
import { VikunjaConfig } from '../config/types';

/**
 * MCP Server configuration schema for environment variables
 */
const envConfigSchema = z.object({
  /**
   * Required: Vikunja API URL
   * From env: VIKUNJA_API_URL
   */
  VIKUNJA_API_URL: z.string().url(),

  /**
   * Required: Default API token
   * From env: VIKUNJA_API_TOKEN
   * Note: This can be overridden per-request via MCP extra params
   */
  VIKUNJA_API_TOKEN: z.string().min(1),

  // TODO: Add rate limiting configuration once implemented
  // MCP_RATE_LIMIT
  // MCP_RATE_LIMIT_WINDOW
});

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): VikunjaConfig {
  const result = envConfigSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join('\n');

    throw new Error(
      'Invalid MCP server configuration:\n' +
        errors +
        '\n\n' +
        'Required environment variables:\n' +
        '  VIKUNJA_API_URL: Vikunja API base URL\n' +
        '  VIKUNJA_API_TOKEN: Default API token for Vikunja\n'
    );
  }

  return {
    apiUrl: result.data.VIKUNJA_API_URL,
    token: result.data.VIKUNJA_API_TOKEN,
    // TODO: Add rate limiting once implemented
  };
}
