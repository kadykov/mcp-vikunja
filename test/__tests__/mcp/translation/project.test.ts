import { toMcpUri, fromMcpUri } from '../../../../src/mcp/utils/uri';
import { toMcpContent } from '../../../../src/mcp/translation/project';
import { Project } from '../../../../src/types';
import { createProject } from '../../../mocks/factories/project';

describe('Project Translation', () => {
  describe('URI Mapping', () => {
    it('should convert project ID to MCP URI', () => {
      const projectId = 123;
      const uri = toMcpUri(projectId);
      expect(uri).toBe('vikunja://projects/123');
    });

    it('should extract project ID from MCP URI', () => {
      const uri = 'vikunja://projects/123';
      const projectId = fromMcpUri(uri);
      expect(projectId).toBe(123);
    });

    it('should throw error for invalid MCP URI', () => {
      const invalidUris = [
        'invalid://projects/123',
        'vikunja://invalid/123',
        'vikunja://projects/abc',
        'vikunja://projects/',
        'vikunja://projects',
      ];

      invalidUris.forEach(uri => {
        expect(() => fromMcpUri(uri)).toThrow('Invalid MCP project URI format');
      });
    });
  });

  describe('Content Conversion', () => {
    describe('Single Project', () => {
      it('should convert project to JSON content', () => {
        const project = createProject({
          id: 123,
          title: 'Test Project',
          description: 'Project Description',
        });

        const content = toMcpContent(project);
        const parsed = JSON.parse(content) as Project;

        expect(parsed).toEqual(project);
      });

      it('should preserve all project fields in conversion', () => {
        const project = createProject({
          id: 123,
          title: 'Test Project',
          description: 'Project Description',
          identifier: 'TEST-123',
          hex_color: '#FF0000',
          is_archived: false,
          is_favorite: true,
          position: 1,
        });

        const content = toMcpContent(project);
        const parsed = JSON.parse(content) as Project;

        expect(parsed).toEqual(project);
      });

      it('should handle empty fields', () => {
        const project = createProject({
          id: 123,
          title: 'Test Project',
          description: '',
        });

        const content = toMcpContent(project);
        const parsed = JSON.parse(content) as Project;

        expect(parsed).toEqual(project);
      });
    });

    describe('Project List', () => {
      const mockProjects = [
        createProject({ id: 1, title: 'Project 1' }),
        createProject({ id: 2, title: 'Project 2' }),
        createProject({ id: 3, title: 'Project with [special] *chars*' }),
      ];

      it('should render projects as markdown list with links', () => {
        const result = toMcpContent(mockProjects);
        expect(result).toContain('- [Project 1](vikunja://projects/1)');
        expect(result).toContain('- [Project 2](vikunja://projects/2)');
        expect(result).toContain(
          '- [Project with \\[special\\] \\*chars\\*](vikunja://projects/3)'
        );
      });

      it('should handle empty list', () => {
        expect(toMcpContent([])).toBe('');
      });
    });
  });
});
