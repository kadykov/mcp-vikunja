import { Task } from '../../../src/client/resource/task';
import type { CreateTask, UpdateTask, VikunjaTask } from '../../../src/types/task';
import { mockClient } from './mock-client';
import { createUser } from './user';
import { createLabel } from './label';
import { createTaskAttachment } from './attachment';
import { createTaskReminder } from './reminder';

/**
 * Task Factory
 * Creates a complete Task instance with all required fields
 */
export const createTask = (data?: Partial<VikunjaTask>): Task => {
  // Create default data with required fields
  const defaultData: VikunjaTask = {
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
    repeat_after: 0,
    position: 0,
    hex_color: '',
    bucket_id: 0,
    assignees: [],
    reactions: {},
    related_tasks: {},

    // Related entities with proper defaults
    attachments: [createTaskAttachment()],
    labels: [createLabel()],
    reminders: [createTaskReminder()],
  };

  // Merge data while preserving required fields
  const taskData: VikunjaTask = {
    ...defaultData,
    ...data,
    // Ensure required fields are always present
    id: data?.id ?? defaultData.id,
    created: data?.created ?? defaultData.created,
    updated: data?.updated ?? defaultData.updated,
  };

  // Safely create TaskImpl instance for testing
  return Object.setPrototypeOf(
    {
      ...taskData,
      client: mockClient,
      data: taskData,
    },
    Task.prototype
  ) as Task;
};

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
