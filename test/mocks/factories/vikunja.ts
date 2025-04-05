import type { VikunjaProject, VikunjaUser, VikunjaTask } from '../../../src/types';

/**
 * Creates a raw Vikunja API user object for testing
 */
export function createVikunjaUser(data?: Partial<VikunjaUser>): VikunjaUser {
  const timestamp = new Date().toISOString();
  return {
    id: 1,
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    created: timestamp,
    updated: timestamp,
    ...data,
  };
}

/**
 * Creates a raw Vikunja API project object for testing
 */
export function createVikunjaProject(data?: Partial<VikunjaProject>): VikunjaProject {
  const timestamp = new Date().toISOString();
  return {
    id: 1,
    title: 'Test Project',
    description: 'A test project',
    identifier: 'TEST',
    owner: createVikunjaUser(),
    is_archived: false,
    is_favorite: false,
    created: timestamp,
    updated: timestamp,
    ...data,
  };
}

/**
 * Creates a raw Vikunja API task object for testing
 */
export function createVikunjaTask(data?: Partial<VikunjaTask>): VikunjaTask {
  const timestamp = new Date().toISOString();
  return {
    id: 1,
    title: 'Test Task',
    description: 'A test task',
    done: false,
    project_id: 1,
    created: timestamp,
    updated: timestamp,
    created_by: createVikunjaUser(),
    is_favorite: false,
    identifier: 'TASK-1',
    index: 1,
    assignees: [],
    attachments: [],
    labels: [],
    priority: 0,
    percent_done: 0,
    reactions: {},
    subscription: {
      id: 0,
      entity: 1,
      entity_id: 1,
      created: timestamp,
    },
    ...data,
  };
}
