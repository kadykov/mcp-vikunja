import type { Project, CreateProject, UpdateProject, VikunjaProject } from '../../types';
import { BaseResource } from './base.js';

export interface IProjectResource {
  /**
   * Get a project by its ID
   * @param id The project ID
   * @returns The project details
   */
  get(id: number): Promise<Project>;

  /**
   * Create a new project
   * @param data The project data to create
   * @returns The created project
   */
  create(data: CreateProject): Promise<Project>;

  /**
   * Update an existing project
   * @param id The project ID to update
   * @param data The project data to update
   * @returns The updated project
   */
  update(id: number, data: UpdateProject): Promise<Project>;

  /**
   * Delete a project
   * @param id The project ID to delete
   */
  delete(id: number): Promise<void>;

  /**
   * List all projects the user has access to
   * @returns Array of projects
   */
  list(): Promise<Project[]>;
}

export class ProjectResource extends BaseResource<Project> implements IProjectResource {
  /**
   * Transform a Vikunja project to our Project type
   * Ensures required fields are present and handles type conversions
   *
   * @throws Error if required fields are missing
   */
  private transformProject(vikunjaProject: VikunjaProject): Project {
    if (
      !vikunjaProject.id ||
      !vikunjaProject.title ||
      !vikunjaProject.created ||
      !vikunjaProject.updated
    ) {
      throw new Error('Invalid project data: missing required fields');
    }

    // Convert Vikunja user to our User type (ensuring required fields)
    const owner = vikunjaProject.owner
      ? {
          id: vikunjaProject.owner.id ?? 0,
          username: vikunjaProject.owner.username ?? 'unknown',
          email: vikunjaProject.owner.email ?? '',
          name: vikunjaProject.owner.name ?? '',
          created: vikunjaProject.owner.created ?? vikunjaProject.created,
          updated: vikunjaProject.owner.updated ?? vikunjaProject.updated,
        }
      : {
          id: 0,
          username: 'unknown',
          email: '',
          name: '',
          created: vikunjaProject.created,
          updated: vikunjaProject.updated,
        };

    return {
      id: vikunjaProject.id,
      title: vikunjaProject.title,
      description: vikunjaProject.description,
      identifier: vikunjaProject.identifier ?? '',
      owner,
      is_archived: vikunjaProject.is_archived ?? false,
      is_favorite: vikunjaProject.is_favorite ?? false,
      created: vikunjaProject.created,
      updated: vikunjaProject.updated,
      background_blur_hash: vikunjaProject.background_blur_hash,
      background_information: vikunjaProject.background_information,
      hex_color: vikunjaProject.hex_color,
      parent_project_id: vikunjaProject.parent_project_id,
      position: vikunjaProject.position,
      subscription: vikunjaProject.subscription,
      views: vikunjaProject.views ?? [],
    };
  }

  async get(id: number): Promise<Project> {
    const vikunjaProject = await this.client.get<VikunjaProject>(`/projects/${id}`);
    return this.transformProject(vikunjaProject);
  }

  async create(data: CreateProject): Promise<Project> {
    const vikunjaProject = await this.client.put<VikunjaProject>('/projects', data);
    return this.transformProject(vikunjaProject);
  }

  async update(id: number, data: UpdateProject): Promise<Project> {
    const vikunjaProject = await this.client.post<VikunjaProject>(`/projects/${id}`, data);
    return this.transformProject(vikunjaProject);
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/projects/${id}`);
  }

  async list(): Promise<Project[]> {
    const vikunjaProjects = await this.client.get<VikunjaProject[]>('/projects');
    return vikunjaProjects.map(p => this.transformProject(p));
  }
}
