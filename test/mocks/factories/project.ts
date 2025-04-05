import type { Project } from '../../../src/types';
import { createUser } from './user';

/**
 * Project Factory
 * Creates a complete Project instance with all required fields
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
  background_blur_hash: undefined,
  background_information: undefined,
  hex_color: undefined,
  parent_project_id: undefined,
  position: undefined,
  subscription: undefined,
  views: [],
  ...data,
});
