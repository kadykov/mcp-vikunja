import type { components } from './openapi';

// Original OpenAPI type
export type VikunjaUser = components['schemas']['user.User'];

/**
 * User type reexported from Vikunja API
 * All attributes are readonly to prevent accidental modifications
 */
export interface User {
  readonly id: NonNullable<VikunjaUser['id']>;
  readonly username: NonNullable<VikunjaUser['username']>;
  readonly email: VikunjaUser['email'];
  readonly name: VikunjaUser['name'];
  readonly created: NonNullable<VikunjaUser['created']>;
  readonly updated: NonNullable<VikunjaUser['updated']>;
}
