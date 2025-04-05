import type { components, paths } from './openapi';

/**
 * Re-export our custom types
 */

// User types
export type { User, VikunjaUser } from './user';

// Project types
export type {
  Project,
  CreateProject,
  UpdateProject,
  VikunjaProject,
  VikunjaProjectView,
} from './project';

// Task types
export type { Task, CreateTask, UpdateTask, VikunjaTask } from './task';

// Task relations
export type { TaskRelation, CreateTaskRelation, RelatedTaskMap } from './relation';

// Task reminders
export type {
  TaskReminder,
  CreateTaskReminder,
  UpdateTaskReminder,
  ReminderRelation,
} from './reminder';

// Comment types
export type {
  TaskComment,
  CreateTaskComment,
  UpdateTaskComment,
  Reaction,
  ReactionMap,
} from './comment';

// Task-related types
export type { TaskAttachment, CreateTaskAttachment } from './attachment';
export type { Label, CreateLabel, UpdateLabel } from './label';
export type { Bucket, CreateBucket, UpdateBucket } from './bucket';

/**
 * Export system-level Vikunja API types
 */
export type UserSettings = components['schemas']['v1.UserSettings'];
export type Right = components['schemas']['models.Right'];
export type HTTPError = components['schemas']['web.HTTPError'];

// Path types for API endpoints
export type Paths = paths;
