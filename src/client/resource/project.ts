import { VikunjaHttpClient } from '../http/client.js';
import type { CreateProject, UpdateProject, VikunjaProject, CreateTask, User } from '../../types';
import type { components } from '../../types/openapi';
import { Task } from './task.js';

export class ProjectImpl {
  private constructor(
    private client: VikunjaHttpClient,
    private data: components['schemas']['models.Project']
  ) {
    // Validate required fields
    if (!data.id || !data.title || !data.created || !data.updated) {
      throw new Error('Invalid project data: missing required fields');
    }
  }

  // Factory methods
  static async create(client: VikunjaHttpClient, data: CreateProject): Promise<ProjectImpl> {
    const response = await client.put<VikunjaProject>('/projects', data);
    return new ProjectImpl(client, response);
  }

  static async get(client: VikunjaHttpClient, id: number): Promise<ProjectImpl> {
    const response = await client.get<VikunjaProject>(`/projects/${id}`);
    return new ProjectImpl(client, response);
  }

  static async list(client: VikunjaHttpClient): Promise<ProjectImpl[]> {
    const response = await client.get<VikunjaProject[]>('/projects');
    return response.map(p => new ProjectImpl(client, p));
  }

  // Instance methods
  async update(data: UpdateProject): Promise<void> {
    const response = await this.client.post<VikunjaProject>(`/projects/${this.id}`, data);
    this.data = response;
  }

  async delete(): Promise<void> {
    await this.client.delete(`/projects/${this.id}`);
  }

  // Task-related methods
  async createTask(data: Omit<CreateTask, 'project_id'>): Promise<Task> {
    const fullData = { ...data, project_id: this.id } as CreateTask;
    return Task.create(this.client, this.id, fullData);
  }

  async listTasks(): Promise<Task[]> {
    const response = await this.client.get<components['schemas']['models.Task'][]>(
      `/projects/${this.id}/tasks`
    );
    const tasks = await Promise.all(response.map(t => Task.get(this.client, t.id!)));
    return tasks;
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
  get identifier(): string {
    return this.data.identifier ?? '';
  }
  get is_archived(): boolean {
    return this.data.is_archived ?? false;
  }
  get is_favorite(): boolean {
    return this.data.is_favorite ?? false;
  }
  get created(): string {
    return this.data.created!;
  }
  get updated(): string {
    return this.data.updated!;
  }
  get background_blur_hash(): string | undefined {
    return this.data.background_blur_hash;
  }
  get background_information(): unknown {
    return this.data.background_information;
  }
  get hex_color(): string | undefined {
    return this.data.hex_color;
  }
  get parent_project_id(): number | undefined {
    return this.data.parent_project_id;
  }
  get position(): number | undefined {
    return this.data.position;
  }

  get subscription(): components['schemas']['models.Subscription'] | undefined {
    return this.data.subscription;
  }

  get views(): components['schemas']['models.ProjectView'][] {
    return this.data.views ?? [];
  }

  get owner(): User {
    const owner = this.data.owner;
    return owner
      ? {
          id: owner.id ?? 0,
          username: owner.username ?? 'unknown',
          email: owner.email ?? '',
          name: owner.name ?? '',
          created: owner.created ?? this.data.created!,
          updated: owner.updated ?? this.data.updated!,
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
}

// Factory class for convenient client access
export class ProjectResource {
  constructor(private client: VikunjaHttpClient) {}

  create(data: CreateProject): Promise<ProjectImpl> {
    return ProjectImpl.create(this.client, data);
  }

  get(id: number): Promise<ProjectImpl> {
    return ProjectImpl.get(this.client, id);
  }

  list(): Promise<ProjectImpl[]> {
    return ProjectImpl.list(this.client);
  }
}

// For use in other files
export { ProjectImpl as Project };
