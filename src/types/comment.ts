import type { components } from './openapi';
import type { User } from './user';

type VikunjaTaskComment = components['schemas']['models.TaskComment'];
type VikunjaReaction = components['schemas']['models.Reaction'];

/**
 * Type for a reaction on a task or comment
 */
export interface Reaction {
  /**
   * The actual reaction. This can be any valid utf character or text, up to a length of 20.
   */
  readonly value: NonNullable<VikunjaReaction['value']>;

  /**
   * The user who reacted
   */
  readonly user: User;

  /**
   * A timestamp when this reaction was created.
   */
  readonly created: NonNullable<VikunjaReaction['created']>;
}

/**
 * Map of reactions, where the key is the reaction value and the value is an array of users
 */
export interface ReactionMap {
  [value: string]: User[];
}

/**
 * Task comment type
 */
export interface TaskComment {
  /**
   * The unique id of this comment
   */
  readonly id: NonNullable<VikunjaTaskComment['id']>;

  /**
   * The comment text
   */
  readonly comment: NonNullable<VikunjaTaskComment['comment']>;

  /**
   * The user who wrote this comment
   */
  readonly author: User;

  /**
   * A timestamp when this comment was created.
   */
  readonly created: NonNullable<VikunjaTaskComment['created']>;

  /**
   * A timestamp when this comment was last updated.
   */
  readonly updated: NonNullable<VikunjaTaskComment['updated']>;

  /**
   * Reactions to this comment
   */
  readonly reactions?: ReactionMap;
}

/**
 * Type for creating a new comment
 */
export interface CreateTaskComment {
  /**
   * The comment text
   */
  comment: string;
}

/**
 * Type for updating an existing comment
 */
export type UpdateTaskComment = CreateTaskComment;
