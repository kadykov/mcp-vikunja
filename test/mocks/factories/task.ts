import type { Task, CreateTask, UpdateTask } from '../../../src/types';
import { createUser } from './user';
import { createTaskComment } from './comment';
import { createLabel } from './label';
import { createTaskAttachment } from './attachment';
import { createTaskReminder } from './reminder';

/**
 * Task Factory
 * Creates a complete Task instance with all required fields
 */
export const createTask = (data?: Partial<Task>): Task => ({
  // Required fields
  id: 1,
  title: 'Test Task',
  project_id: 1,
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  created_by: createUser(),
  is_favorite: false,
  identifier: 'TEST-1',
  index: 1,

  // Optional fields
  description: 'A test task',
  done: false,
  done_at: undefined,
  priority: 0,
  percent_done: 0,
  start_date: undefined,
  end_date: undefined,
  due_date: undefined,
  repeat_after: undefined,
  position: 0,
  hex_color: undefined,
  bucket_id: undefined,
  assignees: [],
  reactions: {},
  related_tasks: {},

  // Related entities with proper defaults
  attachments: [createTaskAttachment()],
  comments: [createTaskComment()],
  labels: [createLabel()],
  reminders: [createTaskReminder()],

  ...data,
});

/**
 * Create Task params factory
 */
export const createTaskParams = (data?: Partial<CreateTask>): CreateTask => ({
  title: 'New Test Task',
  project_id: 1,
  description: 'A new test task',
  priority: 0,
  percent_done: 0,
  position: 0,
  ...data,
});

/**
 * Update Task params factory
 */
export const updateTaskParams = (data?: Partial<UpdateTask>): UpdateTask => ({
  title: 'Updated Test Task',
  description: 'An updated test task',
  ...data,
});

/**
 * Helper function to create multiple tasks
 */
export const createTasks = (count: number, baseData?: Partial<Task>): Task[] =>
  Array.from({ length: count }, (_, index) =>
    createTask({
      id: index + 1,
      title: `Test Task ${index + 1}`,
      position: index,
      ...baseData,
    })
  );
