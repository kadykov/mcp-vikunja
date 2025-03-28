import { z } from 'zod';
import type { Task, User } from '../types';

// User validation schema
export const userSchema = z.object({
  id: z.number().positive(),
  username: z.string().min(1),
  email: z.string().email(),
  name: z.string().optional(),
  created: z.string().datetime(),
  updated: z.string().datetime(),
});

// Task validation schema
export const taskSchema = z.object({
  id: z.number().positive(),
  title: z.string().min(1),
  description: z.string().optional(),
  done: z.boolean(),
  done_at: z.string().datetime().optional(),
  due_date: z.string().datetime().optional(),
  created: z.string().datetime(),
  updated: z.string().datetime(),
  created_by: userSchema,
  project_id: z.number().positive(),
  // Optional fields
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  repeat_after: z.number().optional(),
  priority: z.number().optional(),
  hex_color: z.string().optional(),
  position: z.number().optional(),
  bucket_id: z.number().positive().optional(),
});

export function validateTaskResponse(task: unknown): asserts task is Task {
  const result = taskSchema.safeParse(task);

  if (!result.success) {
    throw new Error(`Invalid task response: ${result.error.message}`);
  }
}

export function validateUserResponse(user: unknown): asserts user is User {
  const result = userSchema.safeParse(user);

  if (!result.success) {
    throw new Error(`Invalid user response: ${result.error.message}`);
  }
}
