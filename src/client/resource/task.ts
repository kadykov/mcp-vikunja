import { VikunjaHttpClient } from '../http/client';
import { Task } from '../../types';
import { BaseResource } from './base';

export class TaskResource extends BaseResource<Task> {
  constructor(client: VikunjaHttpClient) {
    super(client);
  }

  async get(id: number): Promise<Task> {
    const response = await this.client.get<{ data: Task }>(`/tasks/${id}`);
    return response.data;
  }

  async create(data: Partial<Task>): Promise<Task> {
    const response = await this.client.put<{ data: Task }>('/projects/1/tasks', data);
    return response.data;
  }

  async update(id: number, data: Partial<Task>): Promise<Task> {
    const response = await this.client.post<{ data: Task }>(`/tasks/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/tasks/${id}`);
  }

  async list(): Promise<Task[]> {
    const response = await this.client.get<{ data: Task[] }>('/projects/1/tasks');
    return response.data;
  }
}
