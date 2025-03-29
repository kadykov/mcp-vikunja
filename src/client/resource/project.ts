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
    return this.client.get<Project>(`/projects/${id}`);
  }

  async create(data: Partial<Project>): Promise<Project> {
    return this.client.put<Project>('/projects', data);
  }

  async update(id: number, data: Partial<Project>): Promise<Project> {
    return this.client.post<Project>(`/projects/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/projects/${id}`);
  }

  async list(): Promise<Project[]> {
    return this.client.get<Project[]>('/projects');
  }
}
