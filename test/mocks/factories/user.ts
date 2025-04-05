import type { User } from '../../../src/types';

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
