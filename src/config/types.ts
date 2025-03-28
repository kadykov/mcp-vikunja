/**
 * Configuration interface for the Vikunja MCP server
 */
export interface VikunjaConfig {
  /** Base URL of the Vikunja API */
  apiUrl: string;

  /** Authentication token for Vikunja API */
  token: string;

  /** Optional rate limiting configuration */
  rateLimit?: {
    /** Maximum number of requests in the time window */
    maxRequests: number;

    /** Time window in milliseconds */
    timeWindow: number;
  };
}

/**
 * Configuration validation error
 */
export interface ConfigError {
  /** Error code for identifying the type of error */
  code: string;

  /** Human-readable error message */
  message: string;

  /** Optional field name that caused the error */
  field?: string;
}
