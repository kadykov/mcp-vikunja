import { ProjectMarkdownRenderer } from '../../../../src/renderers/markdown/ProjectMarkdownRenderer';
import { createProject } from '../../../mocks/factories/project';
import { toMcpUri } from '../../../../src/mcp/utils/uri';
import { escapeMarkdown } from '../../../../src/renderers/utils/markdown-helpers';

describe('ProjectMarkdownRenderer', () => {
  const renderer = new ProjectMarkdownRenderer();

  const mockTasks = [
    { id: 1, title: 'Task 1', done: false },
    { id: 2, title: 'Task 2', done: true },
  ];

  const mockProject = createProject({
    id: 1,
    title: 'Test Project',
    description: 'A test project',
  });
  mockProject.listTasks = jest.fn().mockResolvedValue(mockTasks);

  const archivedProject = createProject({
    id: 2,
    title: 'Archived Project',
    description: 'An archived project',
    is_archived: true,
  });
  archivedProject.listTasks = jest.fn().mockResolvedValue([]);

  const mockProjects = [
    createProject({ id: 1, title: 'Project 1' }),
    createProject({ id: 2, title: 'Project 2' }),
    createProject({ id: 3, title: 'Project with [special] *chars*' }),
  ];

  describe('render', () => {
    it('should render a project with all details', async () => {
      const result = await renderer.render(mockProject);
      expect(result).toBe(
        [
          '# Test Project',
          '',
          '## Tasks',
          '- [ ] [Task 1](vikunja://tasks/1)',
          '- [x] [Task 2](vikunja://tasks/2)',
        ].join('\n')
      );
    });

    it('should render an archived project', async () => {
      const result = await renderer.render(archivedProject);
      expect(result).toBe(
        ['# Archived Project', '(ARCHIVED)', '', 'An archived project'].join('\n')
      );
    });

    it('should throw error when task loading fails', async () => {
      const mockErrorProject = createProject({ id: 4, title: 'Error Project' });
      mockErrorProject.listTasks = jest.fn().mockRejectedValue(new Error('Failed to load tasks'));

      await expect(renderer.render(mockErrorProject)).rejects.toThrow('Failed to load tasks');
    });
  });

  describe('renderAsListItem', () => {
    it('should render a project as a markdown list item with link', async () => {
      const result = await renderer.renderAsListItem(mockProject);
      expect(result).toBe(`- [Test Project](${toMcpUri(mockProject.id)})`);
    });

    it('should render an archived project with prefix', async () => {
      const result = await renderer.renderAsListItem(archivedProject);
      expect(result).toBe(`- (ARCHIVED) [Archived Project](${toMcpUri(archivedProject.id)})`);
    });

    it('should handle special characters in project title', async () => {
      const result = await renderer.renderAsListItem(mockProjects[2]);
      expect(result).toBe(
        `- [Project with \\[special\\] \\*chars\\*](${toMcpUri(mockProjects[2].id)})`
      );
    });
  });

  describe('renderList', () => {
    it('should render multiple projects as a markdown list', async () => {
      const result = await renderer.renderList(mockProjects);
      const expected = mockProjects
        .map(p => `- [${escapeMarkdown(p.title)}](${toMcpUri(p.id)})`)
        .join('\n');
      expect(result).toBe(expected);
    });

    it('should handle empty list', async () => {
      const result = await renderer.renderList([]);
      expect(result).toBe('');
    });
  });
});
