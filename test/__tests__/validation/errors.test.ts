import { describe, expect, it } from '@jest/globals';
import { z } from 'zod';
import { ValidationError } from '../../../src/validation/errors';

describe('ValidationError', () => {
  it('should create basic validation error', () => {
    const error = new ValidationError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('ValidationError');
    expect(error.zodError).toBeUndefined();
  });

  it('should create validation error from zod error', () => {
    // Create a test schema
    const schema = z.object({
      name: z.string(),
      age: z.number().positive(),
    });

    // Create invalid data
    const invalidData = {
      name: 123, // Should be string
      age: -1, // Should be positive
    };

    // Get zod error
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const error = ValidationError.fromZodError(result.error);

      // Test error properties
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.name).toBe('ValidationError');
      expect(error.zodError).toBe(result.error);

      // Test error message format
      expect(error.message).toContain('Validation failed:');
      expect(error.message).toContain('name:');
      expect(error.message).toContain('age:');

      // Verify we can access the original zod error details
      expect(error.zodError?.errors).toHaveLength(2);
    }
  });

  it('should format nested path in error message', () => {
    // Create a test schema with nested objects
    const schema = z.object({
      user: z.object({
        profile: z.object({
          email: z.string().email(),
        }),
      }),
    });

    // Create invalid data with nested path
    const invalidData = {
      user: {
        profile: {
          email: 'not-an-email',
        },
      },
    };

    // Get zod error
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const error = ValidationError.fromZodError(result.error);

      // Test nested path in error message
      expect(error.message).toContain('user.profile.email:');
      expect(error.message).toContain('Invalid email');
    }
  });

  it('should handle multiple validation errors', () => {
    // Create a test schema with multiple possible errors
    const schema = z.object({
      username: z.string().min(3),
      email: z.string().email(),
      age: z.number().min(18),
    });

    // Create invalid data that triggers multiple errors
    const invalidData = {
      username: 'a', // Too short
      email: 'invalid', // Not an email
      age: 15, // Too young
    };

    // Get zod error
    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const error = ValidationError.fromZodError(result.error);

      // Test that all errors are included in the message
      expect(error.message).toContain('username:');
      expect(error.message).toContain('email:');
      expect(error.message).toContain('age:');

      // Test that errors are properly separated
      const errorParts = error.message.split(',').map(part => part.trim());
      expect(errorParts).toHaveLength(3);

      // Verify we can access all original zod errors
      expect(error.zodError?.errors).toHaveLength(3);
    }
  });
});
