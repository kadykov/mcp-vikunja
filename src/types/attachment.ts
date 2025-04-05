import type { components } from './openapi';
import type { User } from './user';

type VikunjaTaskAttachment = components['schemas']['models.TaskAttachment'];
type VikunjaFile = components['schemas']['files.File'];

/**
 * File type from Vikunja API
 */
interface ApiFile {
  readonly id: NonNullable<VikunjaFile['id']>;
  readonly name: NonNullable<VikunjaFile['name']>;
  readonly mime: NonNullable<VikunjaFile['mime']>;
  readonly size: NonNullable<VikunjaFile['size']>;
  readonly created: NonNullable<VikunjaFile['created']>;
}

/**
 * Task attachment type
 * Represents a file attached to a task
 */
export interface TaskAttachment {
  /**
   * The unique, numeric id of this attachment
   */
  readonly id: NonNullable<VikunjaTaskAttachment['id']>;

  /**
   * The task this attachment belongs to
   */
  readonly task_id: NonNullable<VikunjaTaskAttachment['task_id']>;

  /**
   * A timestamp when this attachment was created
   */
  readonly created: NonNullable<VikunjaTaskAttachment['created']>;

  /**
   * The user who created this attachment
   */
  readonly created_by: User;

  /**
   * File details
   */
  readonly file?: ApiFile;
}

/**
 * Parameters for creating a task attachment
 * This type is used when uploading new attachments
 */
export interface CreateTaskAttachment {
  /**
   * The task to attach the file to
   */
  task_id: number;

  /**
   * The file to upload
   */
  file: File;
}
