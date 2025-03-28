import type { Project, Task, TaskComment, User } from '../../src/types';

/**
 * Project Factory
 */
export const createProject = (data?: Partial<Project>): Project => ({
  id: 1,
  title: 'Test Project',
  description: 'A test project',
  identifier: 'TEST',
  owner: createUser(),
  is_archived: false,
  is_favorite: false,
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  ...data,
});

/**
 * Task Factory
 */
export const createTask = (data?: Partial<Task>): Task => ({
  id: 1,
  title: 'Test Task',
  description: 'A test task',
  project_id: 1,
  identifier: 'TASK-1',
  index: 1,
  done: false,
  done_at: undefined, // Changed from null to undefined
  created_by: createUser(),
  is_favorite: false,
  position: 0,
  percent_done: 0,
  priority: 0,
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  ...data,
});

/**
 * Comment Factory
 */
export const createComment = (data?: Partial<TaskComment>): TaskComment => ({
  id: 1,
  comment: 'Test comment',
  author: createUser(),
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  ...data,
});

/**
 * User Factory
 */
export const createUser = (data?: Partial<User>): User => ({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  name: 'Test User',
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  ...data,
});
