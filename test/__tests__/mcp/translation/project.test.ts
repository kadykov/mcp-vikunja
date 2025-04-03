import { toMcpUri, fromMcpUri, toMcpContent } from '../../../../src/mcp/translation/project';
import { Project } from '../../../../src/types';

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
    it('should convert project to JSON content', () => {
      const project: Project = {
        id: 123,
        title: 'Test Project',
        description: 'Project Description',
        created: '2024-01-01T00:00:00Z',
        updated: '2024-01-02T00:00:00Z',
      };

      const content = toMcpContent(project);
      const parsed = JSON.parse(content) as Project;

      expect(parsed).toEqual(project);
    });

    it('should preserve all project fields in conversion', () => {
      const project: Project = {
        id: 123,
        title: 'Test Project',
        description: 'Project Description',
        identifier: 'TEST-123',
        hex_color: '#FF0000',
        owner: { id: 1, username: 'test' },
        created: '2024-01-01T00:00:00Z',
        updated: '2024-01-02T00:00:00Z',
        is_archived: false,
        is_favorite: true,
        position: 1,
      };

      const content = toMcpContent(project);
      const parsed = JSON.parse(content) as Project;

      expect(parsed).toEqual(project);
    });

    it('should handle empty fields', () => {
      const project: Project = {
        id: 123,
        title: 'Test Project',
        description: '',
        created: '2024-01-01T00:00:00Z',
        updated: '2024-01-02T00:00:00Z',
      };

      const content = toMcpContent(project);
      const parsed = JSON.parse(content) as Project;

      expect(parsed).toEqual(project);
    });
  });
});
