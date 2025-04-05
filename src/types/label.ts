import type { components } from './openapi';
import type { User } from './user';

type VikunjaLabel = components['schemas']['models.Label'];

/**
 * Task label type
 */
export interface Label {
  /**
   * The unique, numeric id of this label.
   */
  readonly id: NonNullable<VikunjaLabel['id']>;

  /**
   * The title of the label. You'll see this one on tasks associated with it.
   * @maxLength 250
   * @minLength 1
   */
  readonly title: NonNullable<VikunjaLabel['title']>;

  /**
   * The label description.
   */
  readonly description?: VikunjaLabel['description'];

  /**
   * The color this label has in hex format.
   * @maxLength 7
   */
  readonly hex_color?: VikunjaLabel['hex_color'];

  /**
   * The user who created this label
   */
  readonly created_by: User;

  /**
   * A timestamp when this label was created.
   */
  readonly created: NonNullable<VikunjaLabel['created']>;

  /**
   * A timestamp when this label was last updated.
   */
  readonly updated: NonNullable<VikunjaLabel['updated']>;
}

/**
 * Type for creating a new label
 */
export interface CreateLabel {
  /**
   * The title of the label.
   * @maxLength 250
   * @minLength 1
   */
  title: string;

  /**
   * The label description.
   */
  description?: string;

  /**
   * The color this label has in hex format.
   * @maxLength 7
   */
  hex_color?: string;
}

/**
 * Type for updating an existing label
 */
export type UpdateLabel = Partial<CreateLabel>;
