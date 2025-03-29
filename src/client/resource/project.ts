import type { Project } from '../../types';
import { BaseResource } from './base';

export interface IProjectResource {
  get(id: number): Promise<Project>;
  create(data: Partial<Project>): Promise<Project>;
  update(id: number, data: Partial<Project>): Promise<Project>;
  delete(id: number): Promise<void>;
  list(): Promise<Project[]>;
}

export class ProjectResource extends BaseResource<Project> implements IProjectResource {
  async get(id: number): Promise<Project> {
    const response = await this.client.get<{ data: Project }>(`/projects/${id}`);
    return response.data;
  }

  async create(data: Partial<Project>): Promise<Project> {
    const response = await this.client.put<{ data: Project }>('/projects', data);
    return response.data;
  }

  async update(id: number, data: Partial<Project>): Promise<Project> {
    const response = await this.client.post<{ data: Project }>(`/projects/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/projects/${id}`);
  }

  async list(): Promise<Project[]> {
    const response = await this.client.get<{ data: Project[] }>('/projects');
    return response.data;
  }
}
