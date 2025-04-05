import type { components } from './openapi';
import type { Task } from './task';
import type { User } from './user';

type VikunjaBucket = components['schemas']['models.Bucket'];

/**
 * Task bucket type
 */
export interface Bucket {
  /**
   * The unique, numeric id of this bucket.
   */
  readonly id: NonNullable<VikunjaBucket['id']>;

  /**
   * The title of this bucket.
   * @minLength 1
   */
  readonly title: NonNullable<VikunjaBucket['title']>;

  /**
   * The project view this bucket belongs to.
   */
  readonly project_view_id: NonNullable<VikunjaBucket['project_view_id']>;

  /**
   * How many tasks can be at the same time on this board max
   * @minimum 0
   */
  readonly limit: NonNullable<VikunjaBucket['limit']>;

  /**
   * The position this bucket has when querying all buckets.
   */
  readonly position: NonNullable<VikunjaBucket['position']>;

  /**
   * The number of tasks currently in this bucket
   */
  readonly count?: VikunjaBucket['count'];

  /**
   * The user who initially created the bucket.
   */
  readonly created_by: User;

  /**
   * A timestamp when this bucket was created.
   */
  readonly created: NonNullable<VikunjaBucket['created']>;

  /**
   * A timestamp when this bucket was last updated.
   */
  readonly updated: NonNullable<VikunjaBucket['updated']>;

  /**
   * All tasks which belong to this bucket.
   */
  readonly tasks?: Task[];
}

/**
 * Type for creating a new bucket
 */
export interface CreateBucket {
  /**
   * The title of this bucket.
   * @minLength 1
   */
  title: string;

  /**
   * The project view this bucket belongs to.
   */
  project_view_id: number;

  /**
   * How many tasks can be at the same time on this board max
   * @minimum 0
   */
  limit?: number;

  /**
   * The position this bucket has
   */
  position?: number;
}

/**
 * Type for updating an existing bucket
 */
export type UpdateBucket = Partial<CreateBucket>;
