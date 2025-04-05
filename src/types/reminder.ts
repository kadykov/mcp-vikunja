import type { components } from './openapi';

type VikunjaTaskReminder = components['schemas']['models.TaskReminder'];
export type ReminderRelation = components['schemas']['models.ReminderRelation'];

/**
 * Task reminder type
 */
export interface TaskReminder {
  /**
   * The absolute time when the user wants to be reminded of the task.
   */
  readonly reminder: NonNullable<VikunjaTaskReminder['reminder']>;

  /**
   * A period in seconds relative to another date argument.
   * Negative values mean the reminder triggers before the date.
   * Default: 0, triggers when RelativeTo is due.
   */
  readonly relative_period?: NonNullable<VikunjaTaskReminder['relative_period']>;

  /**
   * The name of the date field to which the relative period refers to.
   */
  readonly relative_to?: NonNullable<ReminderRelation>;
}

/**
 * Type for creating a new reminder
 */
export interface CreateTaskReminder {
  /**
   * The absolute time when to remind about this task
   * Format: ISO 8601 date string
   */
  reminder: string;

  /**
   * Optional relative period in seconds.
   * Negative values mean the reminder triggers before the referenced date.
   */
  relative_period?: number;

  /**
   * Optional reference to a task date field (due_date, start_date, or end_date)
   */
  relative_to?: ReminderRelation;
}

/**
 * Type for updating an existing reminder
 */
export type UpdateTaskReminder = CreateTaskReminder;
