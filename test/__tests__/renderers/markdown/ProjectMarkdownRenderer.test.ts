import { ProjectMarkdownRenderer } from '../../../../src/renderers/markdown/ProjectMarkdownRenderer';
import { toMcpUri } from '../../../../src/mcp/translation/project';
import { Project } from '../../../../src/types';

describe('ProjectMarkdownRenderer', () => {
  const renderer = new ProjectMarkdownRenderer();

  const mockProject: Project = {
    id: 1,
    title: 'Test Project',
    description: 'A test project',
    // Add other required fields as needed
  };

  const mockProjects: Project[] = [
    { id: 1, title: 'Project 1' },
    { id: 2, title: 'Project 2' },
    { id: 3, title: 'Project with [special] *chars*' },
  ] as Project[];

  describe('render', () => {
    it('should render a single project as JSON', () => {
      const result = renderer.render(mockProject);
      expect(JSON.parse(result)).toEqual(mockProject);
    });
  });

  describe('renderAsListItem', () => {
    it('should render a project as a markdown list item with link using toMcpUri', () => {
      const result = renderer.renderAsListItem(mockProject);
      expect(result).toBe(`- [${mockProject.title}](${toMcpUri(mockProject.id)})`);
    });

    it('should handle special characters in project title', () => {
      const result = renderer.renderAsListItem(mockProjects[2]);
      expect(result).toBe(`- [${mockProjects[2].title}](${toMcpUri(mockProjects[2].id)})`);
    });

    it('should throw error when project has no ID', () => {
      const invalidProject = { title: 'No ID Project' } as Project;
      expect(() => renderer.renderAsListItem(invalidProject)).toThrow(
        'Cannot render project without ID'
      );
    });
  });

  describe('renderList', () => {
    it('should render multiple projects as a markdown list', () => {
      const result = renderer.renderList(mockProjects);
      const expected = mockProjects.map(p => `- [${p.title}](${toMcpUri(p.id)})`).join('\n');
      expect(result).toBe(expected);
    });

    it('should handle empty list', () => {
      const result = renderer.renderList([]);
      expect(result).toBe('');
    });

    it('should throw error if any project in list has no ID', () => {
      const invalidProjects = [
        { id: 1, title: 'Valid Project' },
        { title: 'Invalid Project' },
      ] as Project[];

      expect(() => renderer.renderList(invalidProjects)).toThrow(
        'Cannot render project without ID'
      );
    });
  });
});
