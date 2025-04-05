import type { TaskAttachment, CreateTaskAttachment } from '../../../src/types';
import { createUser } from './user';

/**
 * Task Attachment Factory
 */
export const createTaskAttachment = (data?: Partial<TaskAttachment>): TaskAttachment => ({
  id: 1,
  task_id: 1,
  created: new Date().toISOString(),
  created_by: createUser(),
  file: {
    id: 1,
    name: 'test-file.txt',
    size: 1024,
    mime: 'text/plain',
    created: new Date().toISOString(),
  },
  ...data,
});

/**
 * Create Task Attachment params factory
 * Note: In real tests, you'd need to provide an actual File object
 */
export const createTaskAttachmentParams = (
  data?: Partial<CreateTaskAttachment>
): CreateTaskAttachment => ({
  task_id: 1,
  file: new File(['test content'], 'test.txt', { type: 'text/plain' }),
  ...data,
});
