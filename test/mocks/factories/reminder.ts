import type { TaskReminder, CreateTaskReminder, ReminderRelation } from '../../../src/types';

/**
 * Task Reminder Factory
 */
export const createTaskReminder = (data?: Partial<TaskReminder>): TaskReminder => ({
  reminder: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  relative_period: -3600, // 1 hour before
  relative_to: 'due_date' as ReminderRelation,
  ...data,
});

/**
 * Create Task Reminder params factory
 */
export const createTaskReminderParams = (
  data?: Partial<CreateTaskReminder>
): CreateTaskReminder => ({
  reminder: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  relative_period: -3600, // 1 hour before
  relative_to: 'due_date' as ReminderRelation,
  ...data,
});

/**
 * Helper function to create a reminder relative to a specific date
 */
export const createRelativeReminder = (
  relativeToDate: Date,
  relativePeriod: number = -3600,
  relativeToField: ReminderRelation = 'due_date'
): CreateTaskReminder => ({
  reminder: relativeToDate.toISOString(),
  relative_period: relativePeriod,
  relative_to: relativeToField,
});
