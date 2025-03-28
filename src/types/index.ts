import type { components, paths } from './openapi';

// Project-related types
export type Project = components['schemas']['models.Project'];
export type ProjectView = components['schemas']['models.ProjectView'];

// Task-related types
export type Task = components['schemas']['models.Task'];
export type TaskComment = components['schemas']['models.TaskComment'];
export type TaskAttachment = components['schemas']['models.TaskAttachment'];
export type TaskLabel = components['schemas']['models.Label'];
export type TaskBucket = components['schemas']['models.Bucket'];

// User-related types
export type User = components['schemas']['user.User'];
export type UserSettings = components['schemas']['v1.UserSettings'];

// API-related types
export type Right = components['schemas']['models.Right'];
export type HTTPError = components['schemas']['web.HTTPError'];

// Path types for API endpoints
export type Paths = paths;
