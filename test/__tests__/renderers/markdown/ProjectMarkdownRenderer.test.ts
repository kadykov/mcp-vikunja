import { ProjectMarkdownRenderer } from '../../../../src/renderers/markdown/ProjectMarkdownRenderer';
import { createProject } from '../../../mocks/factories/project';
import { toMcpUri } from '../../../../src/mcp/utils/uri';
import { escapeMarkdown } from '../../../../src/renderers/utils/markdown-helpers';

describe('ProjectMarkdownRenderer', () => {
  const renderer = new ProjectMarkdownRenderer();

  const mockProject = createProject({
    id: 1,
    title: 'Test Project',
    description: 'A test project',
  });

  const mockProjects = [
    createProject({ id: 1, title: 'Project 1' }),
    createProject({ id: 2, title: 'Project 2' }),
    createProject({ id: 3, title: 'Project with [special] *chars*' }),
  ];

  describe('render', () => {
    it('should render a single project as JSON', () => {
      const result = renderer.render(mockProject);
      expect(JSON.parse(result)).toEqual(mockProject);
    });
  });

  describe('renderAsListItem', () => {
    it('should render a project as a markdown list item with link', () => {
      const result = renderer.renderAsListItem(mockProject);
      expect(result).toBe(`- [Test Project](${toMcpUri(mockProject.id)})`);
    });

    it('should handle special characters in project title', () => {
      const result = renderer.renderAsListItem(mockProjects[2]);
      expect(result).toBe(
        `- [Project with \\[special\\] \\*chars\\*](${toMcpUri(mockProjects[2].id)})`
      );
    });

    it('should handle untitled project', () => {
      const untitledProject = createProject({ id: 4, title: undefined });
      const result = renderer.renderAsListItem(untitledProject);
      expect(result).toBe(`- [Untitled Project](${toMcpUri(untitledProject.id)})`);
    });
  });

  describe('renderList', () => {
    it('should render multiple projects as a markdown list', () => {
      const result = renderer.renderList(mockProjects);
      const expected = mockProjects
        .map(p => `- [${escapeMarkdown(p.title ?? 'Untitled Project')}](${toMcpUri(p.id)})`)
        .join('\n');
      expect(result).toBe(expected);
    });

    it('should handle empty list', () => {
      const result = renderer.renderList([]);
      expect(result).toBe('');
    });
  });
});
