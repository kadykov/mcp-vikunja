import { Project } from '../../../src/client/resource/project';
import type { VikunjaProject } from '../../../src/types/project';
import { mockClient } from './mock-client';
import { createUser } from './user';

/**
 * Project Factory
 * Creates a complete Project instance with all required fields
 */
export const createProject = (data?: Partial<VikunjaProject>): Project => {
  // Create default data with required fields
  const defaultData: VikunjaProject = {
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
  };

  // Merge data while preserving required fields
  const projectData: VikunjaProject = {
    ...defaultData,
    ...data,
    // Ensure required fields are always present
    id: data?.id ?? defaultData.id,
    created: data?.created ?? defaultData.created,
    updated: data?.updated ?? defaultData.updated,
  };

  // Safely create ProjectImpl instance for testing
  return Object.setPrototypeOf(
    {
      ...projectData,
      client: mockClient,
      data: projectData,
    },
    Project.prototype
  ) as Project;
};
