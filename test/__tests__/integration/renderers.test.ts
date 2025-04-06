import { ProjectMarkdownRenderer } from '../../../src/renderers/markdown/ProjectMarkdownRenderer';
import { TaskMarkdownRenderer } from '../../../src/renderers/markdown/TaskMarkdownRenderer';
import { createProject } from '../../mocks/factories/project';
import { createTask } from '../../mocks/factories/task';
import { createLabel } from '../../mocks/factories/label';
import { createUser } from '../../mocks/factories/user';
import { toMcpContent as toMcpProjectContent } from '../../../src/mcp/translation/project';
import { toMcpContent as toMcpTaskContent } from '../../../src/mcp/translation/task';
import { toMcpUri } from '../../../src/mcp/utils/uri';
import { Project } from '../../../src/types';

describe('Renderer Integration', () => {
  const projectRenderer = new ProjectMarkdownRenderer();

  describe('Project Rendering', () => {
    const mockProjects = [
      createProject({ id: 1, title: 'Project 1' }),
      createProject({ id: 2, title: 'Project 2 with [markdown] *chars*' }),
    ];

    const singleProject = createProject({
      id: 123,
      title: 'Test Project',
      description: 'Test Description',
    });

    it('should generate same output through renderer and translation layer for single project', () => {
      const directOutput = projectRenderer.render(singleProject);
      const translationOutput = toMcpProjectContent(singleProject);

      expect(directOutput).toBe(translationOutput);
      // Verify it's valid JSON
      const parsed = JSON.parse(directOutput) as Project;
      expect(parsed.id).toBe(singleProject.id);
      expect(parsed.title).toBe(singleProject.title);
    });

    it('should generate same output through renderer and translation layer for project list', () => {
      const directOutput = projectRenderer.renderList(mockProjects);
      const translationOutput = toMcpProjectContent(mockProjects);

      expect(directOutput).toBe(translationOutput);
      expect(directOutput).toContain(`- [Project 1](${toMcpUri(1)})`);
    });

    it('should properly escape markdown characters in both paths', () => {
      const projectWithMarkdown = mockProjects[1];
      const directOutput = projectRenderer.renderAsListItem(projectWithMarkdown);
      const expected = `- [Project 2 with \\[markdown\\] \\*chars\\*](${toMcpUri(projectWithMarkdown.id)})`;

      expect(directOutput).toBe(expected);
      expect(toMcpProjectContent([projectWithMarkdown])).toBe(expected);
    });

    it('should handle empty project list consistently', () => {
      const directOutput = projectRenderer.renderList([]);
      const translationOutput = toMcpProjectContent([]);

      expect(directOutput).toBe('');
      expect(translationOutput).toBe('');
    });
  });

  describe('Task Rendering', () => {
    const taskRenderer = new TaskMarkdownRenderer();
    const mockLabel = createLabel({ id: 1, title: 'Important' });
    const mockUser = createUser({ id: 1, username: 'alice' });

    const mockTask = createTask({
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      done: false,
      due_date: '2025-12-31',
      labels: [mockLabel],
      assignees: [mockUser],
    });

    const mockTasks = [
      createTask({ id: 1, title: 'Task 1', done: false, labels: [] }),
      createTask({ id: 2, title: 'Task 2 with [markdown] *chars*', done: true, labels: [] }),
    ];

    it('should generate same output through renderer and translation layer for single task', () => {
      const directOutput = taskRenderer.render(mockTask);
      const translationOutput = toMcpTaskContent(mockTask);

      expect(directOutput).toBe(translationOutput);
    });

    it('should generate same output through renderer and translation layer for task list', () => {
      const directOutput = taskRenderer.renderList(mockTasks);
      const translationOutput = toMcpTaskContent(mockTasks);

      expect(directOutput).toBe(translationOutput);
      expect(directOutput).toContain(`- [ ] [Task 1](${toMcpUri(1)})`);
    });

    it('should properly escape markdown characters in task titles', () => {
      const taskWithMarkdown = mockTasks[1];
      const directOutput = taskRenderer.renderAsListItem(taskWithMarkdown);
      const expected = `- [x] [Task 2 with \\[markdown\\] \\*chars\\*](${toMcpUri(taskWithMarkdown.id)})`;

      expect(directOutput).toBe(expected);
      expect(toMcpTaskContent([taskWithMarkdown])).toBe(expected);
    });

    it('should handle empty task list consistently', () => {
      const directOutput = taskRenderer.renderList([]);
      const translationOutput = toMcpTaskContent([]);

      expect(directOutput).toBe('');
      expect(translationOutput).toBe('');
    });
  });
});
