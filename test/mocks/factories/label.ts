import type { Label, CreateLabel } from '../../../src/types';
import { createUser } from './user';

/**
 * Label Factory
 */
export const createLabel = (data?: Partial<Label>): Label => ({
  id: 1,
  title: 'Test Label',
  description: 'A test label',
  hex_color: '#ff0000',
  created_by: createUser(),
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  ...data,
});

/**
 * Create Label params factory
 */
export const createLabelParams = (data?: Partial<CreateLabel>): CreateLabel => ({
  title: 'New Test Label',
  description: 'A new test label',
  hex_color: '#00ff00',
  ...data,
});
