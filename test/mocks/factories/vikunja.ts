import type { VikunjaProject, VikunjaUser } from '../../../src/types';

/**
 * Creates a raw Vikunja API user object for testing
 */
export function createVikunjaUser(data?: Partial<VikunjaUser>): VikunjaUser {
  return {
    id: 1,
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    ...data,
  };
}

/**
 * Creates a raw Vikunja API project object for testing
 */
export function createVikunjaProject(data?: Partial<VikunjaProject>): VikunjaProject {
  return {
    id: 1,
    title: 'Test Project',
    description: 'A test project',
    identifier: 'TEST',
    owner: createVikunjaUser(),
    is_archived: false,
    is_favorite: false,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    ...data,
  };
}
