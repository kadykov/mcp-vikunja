import { z } from 'zod';
import { VikunjaConfig, ConfigError } from './types';

/**
 * Schema for rate limiting configuration
 */
export const rateLimitSchema = z
  .object({
    maxRequests: z.number().positive('Maximum requests must be positive'),
    timeWindow: z.number().positive('Time window must be positive'),
  })
  .optional();

/**
 * Schema for Vikunja configuration
 */
export const configSchema = z.object({
  apiUrl: z.string().url('API URL must be a valid URL'),
  token: z.string().min(1, 'Token cannot be empty'),
  rateLimit: rateLimitSchema,
});

/**
 * Validates the provided configuration
 * @param config Configuration object to validate
 * @returns Promise that resolves with the validated config or rejects with validation errors
 */
export async function validateConfig(config: unknown): Promise<VikunjaConfig> {
  try {
    return await configSchema.parseAsync(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const configErrors: ConfigError[] = error.errors.map(err => ({
        code: 'VALIDATION_ERROR',
        message: err.message,
        field: err.path.join('.'),
      }));
      throw new Error(`Configuration validation failed: ${JSON.stringify(configErrors)}`);
    }
    throw error;
  }
}
