import type { components } from './openapi';
import type { User } from './user';
import type { Task } from './task';

type VikunjaTaskRelation = components['schemas']['models.TaskRelation'];
type RelationKind = components['schemas']['models.RelationKind'];

/**
 * Task relation type
 */
export interface TaskRelation {
  /**
   * The ID of the "base" task, the task which has a relation to another.
   */
  readonly task_id: NonNullable<VikunjaTaskRelation['task_id']>;

  /**
   * The ID of the other task, the task which is being related.
   */
  readonly other_task_id: NonNullable<VikunjaTaskRelation['other_task_id']>;

  /**
   * The kind of the relation.
   */
  readonly relation_kind: NonNullable<RelationKind>;

  /**
   * The user who created this relation
   */
  readonly created_by: User;

  /**
   * A timestamp when this relation was created.
   */
  readonly created: NonNullable<VikunjaTaskRelation['created']>;
}

/**
 * Map of related tasks, grouped by their relation kind
 */
export interface RelatedTaskMap {
  [kind: string]: Task[];
}

/**
 * Type for creating a new task relation
 */
export interface CreateTaskRelation {
  other_task_id: number;
  relation_kind: RelationKind;
}
