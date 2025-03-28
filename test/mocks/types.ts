import { http } from 'msw';
import type {
  Project,
  Task,
  TaskComment,
  TaskLabel,
  ProjectView,
  User,
  HTTPError,
  TaskBucket,
  TaskAttachment,
} from '../../src/types';

// Request methods
export type RequestMethod = 'get' | 'post' | 'put' | 'delete';

// Response types
export interface ApiSuccessResponse<T> {
  data: T;
  status: number;
}

// Error response type matches Vikunja's HTTPError type
export type ApiErrorResponse = HTTPError;

// Request helper types
export interface RequestConfig {
  params?: Record<string, string>;
  query?: Record<string, string>;
  body?: unknown;
}

// API Handler type using MSW's http object and typed responses
export type ApiHandler = (typeof http)[RequestMethod];

// Response factory types using Vikunja's types
export type ProjectFactory = (data?: Partial<Project>) => Project;
export type TaskFactory = (data?: Partial<Task>) => Task;
export type CommentFactory = (data?: Partial<TaskComment>) => TaskComment;
export type LabelFactory = (data?: Partial<TaskLabel>) => TaskLabel;
export type ViewFactory = (data?: Partial<ProjectView>) => ProjectView;
export type UserFactory = (data?: Partial<User>) => User;
export type BucketFactory = (data?: Partial<TaskBucket>) => TaskBucket;
export type AttachmentFactory = (data?: Partial<TaskAttachment>) => TaskAttachment;

// Error factory with Vikunja's error type
export const createErrorResponse = (code: number, message: string): HTTPError => ({
  code,
  message,
});
