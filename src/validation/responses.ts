import { z } from 'zod';
import type { Task, User } from '../types';
import { ValidationError } from './errors';

// User validation schema
export const userSchema = z.object({
  id: z.number().positive('User ID must be positive'),
  username: z.string().min(1, 'Username cannot be empty'),
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  created: z.string().datetime('Invalid creation date'),
  updated: z.string().datetime('Invalid update date'),
});

// Task validation schema
export const taskSchema = z.object({
  id: z.number().positive('Task ID must be positive'),
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().optional(),
  done: z.boolean(),
  done_at: z.string().datetime('Invalid done date').optional(),
  due_date: z.string().datetime('Invalid due date').optional(),
  created: z.string().datetime('Invalid creation date'),
  updated: z.string().datetime('Invalid update date'),
  created_by: userSchema,
  project_id: z.number().positive('Project ID must be positive'),
  // Optional fields
  start_date: z.string().datetime('Invalid start date').optional(),
  end_date: z.string().datetime('Invalid end date').optional(),
  repeat_after: z.number().optional(),
  priority: z.number().int('Priority must be an integer').optional(),
  hex_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .optional(),
  position: z.number().optional(),
  bucket_id: z.number().positive('Bucket ID must be positive').optional(),
  // Arrays that can be empty
  assignees: z.array(userSchema).optional(),
  labels: z.array(z.any()).optional(), // We'll create a proper label schema when needed
  attachments: z.array(z.any()).optional(),
});

export function validateTaskResponse(task: unknown): asserts task is Task {
  const result = taskSchema.safeParse(task);

  if (!result.success) {
    throw ValidationError.fromZodError(result.error);
  }
}

export function validateUserResponse(user: unknown): asserts user is User {
  const result = userSchema.safeParse(user);

  if (!result.success) {
    throw ValidationError.fromZodError(result.error);
  }
}
