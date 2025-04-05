import { ProjectMarkdownRenderer } from '../../../src/renderers/markdown/ProjectMarkdownRenderer';
import { createProject } from '../../mocks/factories/project';
import { toMcpContent } from '../../../src/mcp/translation/project';
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
      const translationOutput = toMcpContent(singleProject);

      expect(directOutput).toBe(translationOutput);
      // Verify it's valid JSON
      const parsed = JSON.parse(directOutput) as Project;
      expect(parsed.id).toBe(singleProject.id);
      expect(parsed.title).toBe(singleProject.title);
    });

    it('should generate same output through renderer and translation layer for project list', () => {
      const directOutput = projectRenderer.renderList(mockProjects);
      const translationOutput = toMcpContent(mockProjects);

      expect(directOutput).toBe(translationOutput);
      expect(directOutput).toContain(`- [Project 1](${toMcpUri(1)})`);
    });

    it('should properly escape markdown characters in both paths', () => {
      const projectWithMarkdown = mockProjects[1];
      const directOutput = projectRenderer.renderAsListItem(projectWithMarkdown);
      const expected = `- [Project 2 with \\[markdown\\] \\*chars\\*](${toMcpUri(projectWithMarkdown.id)})`;

      expect(directOutput).toBe(expected);
      expect(toMcpContent([projectWithMarkdown])).toBe(expected);
    });

    it('should handle empty project list consistently', () => {
      const directOutput = projectRenderer.renderList([]);
      const translationOutput = toMcpContent([]);

      expect(directOutput).toBe('');
      expect(translationOutput).toBe('');
    });
  });
});
