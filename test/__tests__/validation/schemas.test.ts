import { describe, expect, it } from '@jest/globals';
import { validateTaskResponse } from '../../../src/validation/responses';
import { ValidationError } from '../../../src/validation/errors';
import type { Task } from '../../../src/types';

describe('Response Schema Validation', () => {
  describe('Task Response Validation', () => {
    it('should validate a proper task response', () => {
      const validTaskResponse: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        done: false,
        due_date: '2024-03-28T12:00:00Z',
        created: '2024-03-28T12:00:00Z',
        updated: '2024-03-28T12:00:00Z',
        created_by: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          created: '2024-03-28T12:00:00Z',
          updated: '2024-03-28T12:00:00Z',
        },
        project_id: 1,
      };

      expect(() => validateTaskResponse(validTaskResponse)).not.toThrow();
    });

    it('should throw ValidationError with invalid data types', () => {
      const invalidTaskResponse = {
        id: 'not-a-number', // Should be a number
        title: '', // Should not be empty
        description: 123, // Should be a string
        done: 'not-a-boolean', // Should be boolean
        // Missing required fields like project_id
        created_by: {
          id: -1, // Invalid negative ID
          username: '', // Empty username
          email: 'not-an-email', // Invalid email
        },
      };

      expect(() => validateTaskResponse(invalidTaskResponse)).toThrow(ValidationError);
      try {
        validateTaskResponse(invalidTaskResponse);
      } catch (error) {
        if (error instanceof ValidationError) {
          expect(error.message).toContain('id: Expected number');
          expect(error.message).toContain('Title cannot be empty');
          expect(error.message).toContain('Invalid email address');
        } else {
          throw error;
        }
      }
    });

    it('should throw ValidationError with missing required fields', () => {
      const taskWithMissingFields = {
        id: 1,
        // Missing title
        description: 'Test Description',
        done: false,
        created: '2024-03-28T12:00:00Z',
        updated: '2024-03-28T12:00:00Z',
        project_id: 1,
        // Missing created_by
      };

      expect(() => validateTaskResponse(taskWithMissingFields)).toThrow(ValidationError);
      try {
        validateTaskResponse(taskWithMissingFields);
      } catch (error) {
        if (error instanceof ValidationError) {
          expect(error.message).toContain('title: Required');
          expect(error.message).toContain('created_by: Required');
        } else {
          throw error;
        }
      }
    });

    it('should validate optional fields when present', () => {
      const taskWithOptionalFields: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        done: false,
        due_date: '2024-03-28T12:00:00Z',
        created: '2024-03-28T12:00:00Z',
        updated: '2024-03-28T12:00:00Z',
        created_by: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          created: '2024-03-28T12:00:00Z',
          updated: '2024-03-28T12:00:00Z',
        },
        project_id: 1,
        // Optional fields
        start_date: '2024-03-28T10:00:00Z',
        end_date: '2024-03-28T18:00:00Z',
        priority: 1,
        hex_color: '#FF5733',
        position: 1,
        bucket_id: 2,
      };

      expect(() => validateTaskResponse(taskWithOptionalFields)).not.toThrow();
    });

    it('should throw ValidationError with invalid optional field values', () => {
      const taskWithInvalidOptionalFields: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        done: false,
        created: '2024-03-28T12:00:00Z',
        updated: '2024-03-28T12:00:00Z',
        created_by: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          created: '2024-03-28T12:00:00Z',
          updated: '2024-03-28T12:00:00Z',
        },
        project_id: 1,
        // Invalid optional field values
        start_date: 'invalid-date', // Should be ISO date
        priority: -1, // Should be positive
        bucket_id: 0, // Should be positive
      } as any; // Using 'as any' to allow invalid types for testing

      expect(() => validateTaskResponse(taskWithInvalidOptionalFields)).toThrow(ValidationError);
      try {
        validateTaskResponse(taskWithInvalidOptionalFields);
      } catch (error) {
        if (error instanceof ValidationError) {
          expect(error.message).toContain('Invalid start date');
          expect(error.message).toContain('Bucket ID must be positive');
        } else {
          throw error;
        }
      }
    });
  });
});
