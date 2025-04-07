import { server } from '../../../mocks/server';
import { http } from 'msw';
import { createVikunjaProject, createVikunjaTask } from '../../../mocks/factories/vikunja';
import { API_BASE } from '../../../utils/test-helpers';
import { createEmptyResponse } from '../../../utils/test-responses';
import {
  createProjectResponse,
  createProjectListResponse,
  createProjectErrorResponse,
  createTaskResponse,
  createTaskListResponse,
} from '../../../utils/test-utils';
import { VikunjaHttpClient } from '../../../../src/client/http/client';
import { ProjectResource } from '../../../../src/client/resource/project';
import type { CreateProject, UpdateProject } from '../../../../src/types';

describe('Project Resource', () => {
  const client = new VikunjaHttpClient({
    config: {
      apiUrl: API_BASE,
      token: 'test-token',
    },
  });
  const projectResource = new ProjectResource(client);

  describe('Factory Methods', () => {
    test('should create a project through factory', async () => {
      const newProject: CreateProject = {
        title: 'New Project',
        description: 'Project created in test',
      };

      const vikunjaProject = createVikunjaProject({
        id: 1,
        title: newProject.title,
        description: newProject.description,
      });

      server.use(
        http.put(`${API_BASE}/projects`, () => {
          return createProjectResponse(vikunjaProject);
        })
      );

      const project = await projectResource.create(newProject);
      expect(project.title).toBe(newProject.title);
      expect(project.description).toBe(newProject.description);
      expect(project.id).toBe(1);
    });

    test('should get a project by ID', async () => {
      const testTime = new Date().toISOString();
      const vikunjaProject = createVikunjaProject({
        id: 1,
        title: 'Test Project',
        description: 'Test description',
        created: testTime,
        updated: testTime,
        owner: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          created: testTime,
          updated: testTime,
        },
      });

      server.use(
        http.get(`${API_BASE}/projects/1`, () => {
          return createProjectResponse(vikunjaProject);
        })
      );

      const project = await projectResource.get(1);
      expect(project.title).toBe(vikunjaProject.title);
      expect(project.description).toBe(vikunjaProject.description);
      expect(project.owner).toMatchObject({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    test('should list all projects', async () => {
      const testTime = new Date().toISOString();
      const vikunjaProjects = Array(3)
        .fill(null)
        .map((_, i) =>
          createVikunjaProject({
            id: i + 1,
            created: testTime,
            updated: testTime,
          })
        );

      server.use(
        http.get(`${API_BASE}/projects`, () => {
          return createProjectListResponse(vikunjaProjects);
        })
      );

      const projects = await projectResource.list();
      expect(projects).toHaveLength(3);
      projects.forEach((project, index) => {
        expect(project.id).toBe(index + 1);
        expect(project.title).toBeTruthy();
        expect(typeof project.description).toBe('string');
      });
    });
  });

  describe('Instance Methods', () => {
    test('should update project', async () => {
      const updateData: UpdateProject = {
        title: 'Updated Title',
        description: 'Updated description',
      };

      const vikunjaProject = createVikunjaProject({
        id: 1,
        ...updateData,
      });

      server.use(
        http.get(`${API_BASE}/projects/1`, () => {
          return createProjectResponse(vikunjaProject);
        }),
        http.post(`${API_BASE}/projects/1`, () => {
          return createProjectResponse({
            ...vikunjaProject,
            ...updateData,
          });
        })
      );

      const project = await projectResource.get(1);
      await project.update(updateData);
      expect(project.title).toBe(updateData.title);
      expect(project.description).toBe(updateData.description);
    });

    test('should delete project', async () => {
      server.use(
        http.get(`${API_BASE}/projects/1`, () => {
          return createProjectResponse(createVikunjaProject({ id: 1 }));
        }),
        http.delete(`${API_BASE}/projects/1`, () => {
          return createEmptyResponse();
        })
      );

      const project = await projectResource.get(1);
      await expect(project.delete()).resolves.toBeUndefined();
    });
  });

  describe('Task-Related Methods', () => {
    test('should create task in project', async () => {
      const testTime = new Date().toISOString();
      const vikunjaProject = createVikunjaProject({
        id: 1,
        created: testTime,
        updated: testTime,
      });

      const newTask = {
        title: 'New Task',
        description: 'Task description',
      };

      const vikunjaTask = createVikunjaTask({
        id: 1,
        title: newTask.title,
        description: newTask.description,
        project_id: vikunjaProject.id,
      });

      server.use(
        http.get(`${API_BASE}/projects/1`, () => {
          return createProjectResponse(vikunjaProject);
        }),
        http.put(`${API_BASE}/projects/1/tasks`, () => {
          return createTaskResponse(vikunjaTask);
        })
      );

      const project = await projectResource.get(1);
      const task = await project.createTask(newTask);
      expect(task.title).toBe(newTask.title);
      expect(task.description).toBe(newTask.description);
      expect(task.project_id).toBe(project.id);
    });

    test('should list tasks in project', async () => {
      const testTime = new Date().toISOString();
      const vikunjaProject = createVikunjaProject({ id: 1 });
      const vikunjaTasks = Array(3)
        .fill(null)
        .map((_, i) =>
          createVikunjaTask({
            id: i + 1,
            project_id: 1,
            created: testTime,
            updated: testTime,
          })
        );

      server.use(
        http.get(`${API_BASE}/projects/1`, () => {
          return createProjectResponse(vikunjaProject);
        }),
        http.get(`${API_BASE}/projects/1/tasks`, () => {
          return createTaskListResponse(vikunjaTasks);
        }),
        http.get(`${API_BASE}/tasks/:id`, ({ params }) => {
          const task = vikunjaTasks.find(t => t.id === Number(params.id));
          return createTaskResponse(task!);
        })
      );

      const project = await projectResource.get(1);
      const tasks = await project.listTasks();

      expect(tasks).toHaveLength(3);
      tasks.forEach((task, index) => {
        expect(task.id).toBe(index + 1);
        expect(task.project_id).toBe(project.id);
      });
    });
  });

  describe('Validation', () => {
    test('should validate required fields on creation', async () => {
      const invalidData = {} as CreateProject;
      server.use(
        http.put(`${API_BASE}/projects`, () => {
          return createProjectErrorResponse('invalid_input');
        })
      );

      await expect(projectResource.create(invalidData)).rejects.toThrow();
    });

    test('should handle invalid project ID', async () => {
      server.use(
        http.get(`${API_BASE}/projects/999`, () => {
          return createProjectErrorResponse('not_found');
        })
      );

      await expect(projectResource.get(999)).rejects.toThrow('not found');
    });
  });
});
