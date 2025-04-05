import { VikunjaHttpClient } from '../http/client';
import type { Task, CreateTask, UpdateTask, VikunjaTask, User } from '../../types';
import { BaseResource } from './base';

export class TaskResource extends BaseResource<Task> {
  constructor(client: VikunjaHttpClient) {
    super(client);
  }

  /**
   * Transform a Vikunja task to our Task type
   * Ensures required fields are present and handles type conversions
   *
   * @throws Error if required fields are missing
   */
  private transformTask(vikunjaTask: VikunjaTask): Task {
    if (!vikunjaTask.id || !vikunjaTask.title || !vikunjaTask.created || !vikunjaTask.updated) {
      throw new Error('Invalid task data: missing required fields');
    }

    const transformUser = (user: {
      id?: number;
      username?: string;
      email?: string;
      name?: string;
      created?: string;
      updated?: string;
    }): User => ({
      id: user.id ?? 0,
      username: user.username ?? 'unknown',
      email: user.email ?? '',
      name: user.name ?? '',
      created: user.created ?? vikunjaTask.created ?? new Date().toISOString(),
      updated: user.updated ?? vikunjaTask.updated ?? new Date().toISOString(),
    });

    const assignees = (vikunjaTask.assignees ?? []).map(transformUser);

    return {
      id: vikunjaTask.id,
      title: vikunjaTask.title,
      description: vikunjaTask.description,
      done: vikunjaTask.done ?? false,
      project_id: vikunjaTask.project_id ?? 0,
      priority: vikunjaTask.priority,
      percent_done: vikunjaTask.percent_done,
      position: vikunjaTask.position,
      hex_color: vikunjaTask.hex_color,
      due_date: vikunjaTask.due_date,
      start_date: vikunjaTask.start_date,
      end_date: vikunjaTask.end_date,
      repeat_after: vikunjaTask.repeat_after,
      bucket_id: vikunjaTask.bucket_id,
      created: vikunjaTask.created,
      updated: vikunjaTask.updated,
      created_by: {
        id: vikunjaTask.created_by?.id ?? 0,
        username: vikunjaTask.created_by?.username ?? 'unknown',
        email: vikunjaTask.created_by?.email ?? '',
        name: vikunjaTask.created_by?.name ?? '',
        created: vikunjaTask.created_by?.created ?? vikunjaTask.created,
        updated: vikunjaTask.created_by?.updated ?? vikunjaTask.updated,
      },
      is_favorite: vikunjaTask.is_favorite ?? false,
      identifier: vikunjaTask.identifier ?? '',
      index: vikunjaTask.index ?? 0,
      done_at: vikunjaTask.done_at,
      cover_image_attachment_id: vikunjaTask.cover_image_attachment_id,
      assignees,
      attachments: (vikunjaTask.attachments ?? []).map(attachment => ({
        id: attachment?.id ?? 0,
        task_id: attachment?.task_id ?? 0,
        created: attachment?.created ?? vikunjaTask.created ?? new Date().toISOString(),
        file: {
          id: attachment?.file?.id ?? 0,
          name: attachment?.file?.name ?? '',
          mime: attachment?.file?.mime ?? '',
          size: attachment?.file?.size ?? 0,
          created: attachment?.file?.created ?? vikunjaTask.created ?? new Date().toISOString(),
        },
        created_by: attachment?.created_by
          ? transformUser(attachment.created_by)
          : transformUser({}),
      })),
      buckets: [], // Placeholder for bucket implementation
      comments: [], // Placeholder for comment implementation
      labels: (vikunjaTask.labels ?? []).map(label => ({
        id: label?.id ?? 0,
        title: label?.title ?? '',
        description: label?.description ?? '',
        hex_color: label?.hex_color ?? '',
        created: label?.created ?? vikunjaTask.created ?? new Date().toISOString(),
        updated: label?.updated ?? vikunjaTask.updated ?? new Date().toISOString(),
        created_by: label?.created_by ? transformUser(label.created_by) : transformUser({}),
      })),
      reactions: {}, // Not implementing reactions transformation yet
      related_tasks: {}, // Not implementing related tasks transformation yet
      reminders: (vikunjaTask.reminders ?? []).map(reminder => ({
        reminder: reminder?.reminder ?? '',
        relative_period: reminder?.relative_period ?? 0,
        relative_to: reminder?.relative_to ?? 'due_date',
      })),
      subscription: vikunjaTask.subscription,
    };
  }

  async get(id: number): Promise<Task> {
    const vikunjaTask = await this.client.get<VikunjaTask>(`/tasks/${id}`);
    return this.transformTask(vikunjaTask);
  }

  async create(data: CreateTask): Promise<Task> {
    if (!data.project_id) {
      throw new Error('project_id is required');
    }
    const vikunjaTask = await this.client.put<VikunjaTask>(
      `/projects/${data.project_id}/tasks`,
      data
    );
    return this.transformTask(vikunjaTask);
  }

  async update(id: number, data: UpdateTask): Promise<Task> {
    const vikunjaTask = await this.client.post<VikunjaTask>(`/tasks/${id}`, data);
    return this.transformTask(vikunjaTask);
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/tasks/${id}`);
  }

  async list(projectId: number): Promise<Task[]> {
    const vikunjaTasks = await this.client.get<VikunjaTask[]>(`/projects/${projectId}/tasks`);
    return vikunjaTasks.map(task => this.transformTask(task));
  }
}
