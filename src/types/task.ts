import type { components } from './openapi';
import type { User } from './user';
import type { Bucket } from './bucket';
import type { Label } from './label';
import type { TaskAttachment } from './attachment';
import type { TaskComment, ReactionMap } from './comment';
import type { TaskReminder } from './reminder';
import type { RelatedTaskMap } from './relation';

// Original OpenAPI types
type VikunjaTask = components['schemas']['models.Task'];

/**
 * Base properties for a task that can be modified by clients
 */
export interface TaskBase {
  /**
   * The task text. This is what you'll see in the project.
   * @minLength 1
   */
  title: VikunjaTask['title'];

  /**
   * The task description.
   */
  description?: VikunjaTask['description'];

  /**
   * Whether a task is done or not.
   */
  done?: VikunjaTask['done'];

  /**
   * The project this task belongs to.
   */
  project_id: NonNullable<VikunjaTask['project_id']>;

  /**
   * The task priority. Can be anything you want, it is possible to sort by this later.
   */
  priority?: VikunjaTask['priority'];

  /**
   * Determines how far a task is left from being done
   */
  percent_done?: VikunjaTask['percent_done'];

  /**
   * The position of the task - used for sorting within a project or bucket
   */
  position?: VikunjaTask['position'];

  /**
   * The task color in hex
   */
  hex_color?: VikunjaTask['hex_color'];

  /**
   * The time when the task is due.
   */
  due_date?: VikunjaTask['due_date'];

  /**
   * When this task starts.
   */
  start_date?: VikunjaTask['start_date'];

  /**
   * When this task ends.
   */
  end_date?: VikunjaTask['end_date'];

  /**
   * An amount in seconds this task repeats itself
   */
  repeat_after?: VikunjaTask['repeat_after'];

  /**
   * The bucket id. Only for tasks in bucket views.
   */
  bucket_id?: VikunjaTask['bucket_id'];
}

/**
 * Type for creating new tasks
 */
export type CreateTask = TaskBase;

/**
 * Type for updating existing tasks
 */
export type UpdateTask = Partial<TaskBase>;

/**
 * Full task type with all server-managed fields
 */
export interface Task extends TaskBase {
  /**
   * The unique, numeric id of this task.
   */
  readonly id: NonNullable<VikunjaTask['id']>;

  /**
   * A timestamp when this task was created.
   */
  readonly created: NonNullable<VikunjaTask['created']>;

  /**
   * A timestamp when this task was last updated.
   */
  readonly updated: NonNullable<VikunjaTask['updated']>;

  /**
   * The user who initially created the task.
   */
  readonly created_by: User;

  /**
   * Whether this task is marked as favorite
   */
  readonly is_favorite: boolean;

  /**
   * The task identifier, based on the project identifier and task index
   */
  readonly identifier: string;

  /**
   * The task index, calculated per project
   */
  readonly index: number;

  /**
   * The time when a task was marked as done.
   */
  readonly done_at?: string;

  /**
   * If this task has a cover image, the field will return the id of the attachment
   */
  readonly cover_image_attachment_id?: number;

  /**
   * An array of users who are assigned to this task
   */
  readonly assignees?: User[];

  /**
   * All attachments this task has
   */
  readonly attachments?: TaskAttachment[];

  /**
   * All buckets across all views this task is part of
   */
  readonly buckets?: Bucket[];

  /**
   * All comments of this task
   */
  readonly comments?: TaskComment[];

  /**
   * An array of labels associated with this task
   */
  readonly labels?: Label[];

  /**
   * Reactions on that task
   */
  readonly reactions?: ReactionMap;

  /**
   * All related tasks, grouped by their relation kind
   */
  readonly related_tasks?: RelatedTaskMap;

  /**
   * An array of reminders associated with this task
   */
  readonly reminders?: TaskReminder[];

  /**
   * The subscription status for the user reading this task
   */
  readonly subscription?: VikunjaTask['subscription'];
}
