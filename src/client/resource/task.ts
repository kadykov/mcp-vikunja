import { VikunjaHttpClient } from '../http/client';
import { Task } from '../../types';
import { BaseResource } from './base';

export class TaskResource extends BaseResource<Task> {
  constructor(client: VikunjaHttpClient) {
    super(client);
  }

  async get(id: number): Promise<Task> {
    const response = await this.client.get<Task>(`/tasks/${id}`);
    return response;
  }

  async create(data: Partial<Task>): Promise<Task> {
    if (!data.project_id) {
      throw new Error('project_id is required');
    }
    const response = await this.client.put<Task>(`/projects/${data.project_id}/tasks`, data);
    return response;
  }

  async update(id: number, data: Partial<Task>): Promise<Task> {
    const response = await this.client.post<Task>(`/tasks/${id}`, data);
    return response;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/tasks/${id}`);
  }

  async list(projectId: number): Promise<Task[]> {
    const response = await this.client.get<Task[]>(`/projects/${projectId}/tasks`);
    return response;
  }
}
