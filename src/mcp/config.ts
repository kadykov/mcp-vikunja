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

  /**
   * Optional: Maximum API requests per window
   * From env: VIKUNJA_API_RATE_LIMIT
   * Default: 500
   */
  VIKUNJA_API_RATE_LIMIT: z.string().regex(/^\d+$/).transform(Number).optional(),

  /**
   * Optional: Rate limit window in milliseconds
   * From env: VIKUNJA_API_RATE_LIMIT_WINDOW
   * Default: 60000 (1 minute)
   */
  VIKUNJA_API_RATE_LIMIT_WINDOW: z.string().regex(/^\d+$/).transform(Number).optional(),
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
    rateLimit: {
      maxRequests: result.data.VIKUNJA_API_RATE_LIMIT ?? 500,
      timeWindow: result.data.VIKUNJA_API_RATE_LIMIT_WINDOW ?? 60000,
    },
  };
}
