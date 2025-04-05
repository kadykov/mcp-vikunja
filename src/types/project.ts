/**
 * This file defines Project-related types that are used across the application.
 * Field types are extracted from the Vikunja API OpenAPI specification to maintain consistency.
 */

import type { components } from './openapi';
import type { User } from './user';

// API types from OpenAPI spec
export type VikunjaProject = components['schemas']['models.Project'];
export type VikunjaProjectView = components['schemas']['models.ProjectView'];

/**
 * Base properties that can be modified by clients
 * Extracted from Vikunja API type definition
 */
export interface ProjectBase {
  /**
   * The title of the project. You'll see this in the overview.
   * @minLength 1
   * @maxLength 250
   */
  title: VikunjaProject['title'];

  /**
   * The description of the project.
   */
  description?: VikunjaProject['description'];

  /**
   * The hex color of this project
   * @maxLength 7
   */
  hex_color?: VikunjaProject['hex_color'];

  /**
   * The unique project short identifier. Used to build task identifiers.
   * @maxLength 10
   * @minLength 0
   */
  identifier?: VikunjaProject['identifier'];

  /**
   * Parent project ID
   */
  parent_project_id?: VikunjaProject['parent_project_id'];

  /**
   * The position this project has when querying all projects.
   */
  position?: VikunjaProject['position'];
}

/**
 * Type for creating new projects - only client-settable fields
 */
export type CreateProject = ProjectBase;

/**
 * Type for updating existing projects
 * Allows partial updates of base fields plus specific updatable server-managed fields
 */
export type UpdateProject = Partial<ProjectBase> & {
  /**
   * Whether a project is archived.
   */
  is_archived?: VikunjaProject['is_archived'];
};

/**
 * Full project type with all server-managed fields
 * All server-managed fields are readonly to prevent accidental modifications
 */
export interface Project extends ProjectBase {
  /**
   * The unique, numeric id of this project.
   */
  readonly id: NonNullable<VikunjaProject['id']>;

  /**
   * A timestamp when this project was created. You cannot change this value.
   */
  readonly created: NonNullable<VikunjaProject['created']>;

  /**
   * A timestamp when this project was last updated. You cannot change this value.
   */
  readonly updated: NonNullable<VikunjaProject['updated']>;

  /**
   * The user who created this project.
   */
  readonly owner: User;

  /**
   * Contains a very small version of the project background to use as a blurry
   * preview until the actual background is loaded.
   */
  readonly background_blur_hash?: VikunjaProject['background_blur_hash'];

  /**
   * Holds extra information about the background set since some background
   * providers require attribution or similar.
   */
  readonly background_information?: VikunjaProject['background_information'];

  /**
   * Whether a project is archived.
   */
  readonly is_archived: NonNullable<VikunjaProject['is_archived']>;

  /**
   * True if a project is a favorite. Favorite projects show up in a separate parent project.
   * This value depends on the user making the call to the api.
   */
  readonly is_favorite: NonNullable<VikunjaProject['is_favorite']>;

  /**
   * The subscription status for the user reading this project.
   * You can only read this property, use the subscription endpoints to modify it.
   * Will only be returned when retrieving one project.
   */
  readonly subscription?: VikunjaProject['subscription'];

  /**
   * Project views
   */
  readonly views?: VikunjaProjectView[];
}
