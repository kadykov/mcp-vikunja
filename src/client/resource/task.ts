import { VikunjaHttpClient } from '../http/client';
import type {
  Task as TaskType,
  CreateTask,
  UpdateTask,
  VikunjaTask,
  User,
  TaskAttachment,
  Label,
  TaskReminder,
  Project,
  TaskComment,
  Bucket,
  ReactionMap,
  RelatedTaskMap,
} from '../../types';
import type { components } from '../../types/openapi';

export class TaskImpl implements TaskType {
  private constructor(
    private client: VikunjaHttpClient,
    private data: components['schemas']['models.Task']
  ) {
    // Validate required fields
    if (!data.id || !data.title || !data.created || !data.updated) {
      throw new Error('Invalid task data: missing required fields');
    }
  }

  // Factory methods
  static async create(
    client: VikunjaHttpClient,
    projectId: number,
    data: CreateTask
  ): Promise<TaskImpl> {
    const response = await client.put<VikunjaTask>(`/projects/${projectId}/tasks`, data);
    return new TaskImpl(client, response);
  }

  static async get(client: VikunjaHttpClient, id: number): Promise<TaskImpl> {
    const response = await client.get<VikunjaTask>(`/tasks/${id}`);
    return new TaskImpl(client, response);
  }

  static async list(client: VikunjaHttpClient): Promise<TaskImpl[]> {
    const response = await client.get<VikunjaTask[]>('/tasks/all');
    return response.map(t => new TaskImpl(client, t));
  }

  // Instance methods
  async update(data: UpdateTask): Promise<void> {
    const response = await this.client.post<VikunjaTask>(`/tasks/${this.id}`, data);
    this.data = response;
  }

  async delete(): Promise<void> {
    await this.client.delete(`/tasks/${this.id}`);
  }

  private transformUser(user: components['schemas']['user.User'] | null | undefined): User {
    return user
      ? {
          id: user.id ?? 0,
          username: user.username ?? 'unknown',
          email: user.email ?? '',
          name: user.name ?? '',
          created: user.created ?? this.data.created!,
          updated: user.updated ?? this.data.updated!,
        }
      : {
          id: 0,
          username: 'unknown',
          email: '',
          name: '',
          created: this.data.created!,
          updated: this.data.updated!,
        };
  }

  // Data getters
  get id(): number {
    return this.data.id!;
  }
  get title(): string {
    return this.data.title!;
  }
  get description(): string {
    return this.data.description ?? '';
  }
  get done(): boolean {
    return this.data.done ?? false;
  }
  get project_id(): number {
    return this.data.project_id!;
  }
  get priority(): number {
    return this.data.priority ?? 0;
  }
  get percent_done(): number {
    return this.data.percent_done ?? 0;
  }
  get position(): number {
    return this.data.position ?? 0;
  }
  get hex_color(): string {
    return this.data.hex_color ?? '';
  }
  get due_date(): string | undefined {
    return this.data.due_date;
  }
  get start_date(): string | undefined {
    return this.data.start_date;
  }
  get end_date(): string | undefined {
    return this.data.end_date;
  }
  get repeat_after(): number {
    return this.data.repeat_after ?? 0;
  }
  get bucket_id(): number {
    return this.data.bucket_id ?? 0;
  }
  get created(): string {
    return this.data.created!;
  }
  get updated(): string {
    return this.data.updated!;
  }
  get created_by(): User {
    return this.transformUser(this.data.created_by);
  }
  get is_favorite(): boolean {
    return this.data.is_favorite ?? false;
  }
  get identifier(): string {
    return this.data.identifier ?? '';
  }
  get index(): number {
    return this.data.index ?? 0;
  }
  get done_at(): string | undefined {
    return this.data.done_at;
  }
  get cover_image_attachment_id(): number | undefined {
    return this.data.cover_image_attachment_id;
  }

  get assignees(): User[] {
    return (this.data.assignees ?? []).map(user => this.transformUser(user));
  }

  get attachments(): TaskAttachment[] {
    return (this.data.attachments ?? []).map(attachment => ({
      id: attachment?.id ?? 0,
      task_id: attachment?.task_id ?? 0,
      created: attachment?.created ?? this.data.created!,
      file: {
        id: attachment?.file?.id ?? 0,
        name: attachment?.file?.name ?? '',
        mime: attachment?.file?.mime ?? '',
        size: attachment?.file?.size ?? 0,
        created: attachment?.file?.created ?? this.data.created!,
      },
      created_by: this.transformUser(attachment?.created_by),
    }));
  }

  get buckets(): Bucket[] {
    return [];
  }
  get comments(): TaskComment[] {
    return [];
  }

  get labels(): Label[] {
    return (this.data.labels ?? []).map(label => ({
      id: label?.id ?? 0,
      title: label?.title ?? '',
      description: label?.description ?? '',
      hex_color: label?.hex_color ?? '',
      created: label?.created ?? this.data.created!,
      updated: label?.updated ?? this.data.updated!,
      created_by: this.transformUser(label?.created_by),
    }));
  }

  get reactions(): ReactionMap {
    return (this.data.reactions as ReactionMap) ?? {};
  }

  get related_tasks(): RelatedTaskMap {
    return (this.data.related_tasks as RelatedTaskMap) ?? {};
  }

  get reminders(): TaskReminder[] {
    return (this.data.reminders ?? []).map(reminder => ({
      reminder: reminder?.reminder ?? '',
      relative_period: reminder?.relative_period ?? 0,
      relative_to: reminder?.relative_to ?? 'due_date',
    }));
  }

  get subscription(): VikunjaTask['subscription'] | undefined {
    return this.data.subscription;
  }

  // Relations
  async getProject(): Promise<Project> {
    const { ProjectResource } = await import('./project.js');
    const projectResource = new ProjectResource(this.client);
    return projectResource.get(this.project_id);
  }
}

// Factory class for convenient client access
export class TaskResource {
  constructor(private client: VikunjaHttpClient) {}

  get(id: number): Promise<TaskImpl> {
    return TaskImpl.get(this.client, id);
  }

  list(): Promise<TaskImpl[]> {
    return TaskImpl.list(this.client);
  }
}

// For use in other files
export { TaskImpl as Task };
