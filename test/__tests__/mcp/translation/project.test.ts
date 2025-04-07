import { toMcpUri, fromMcpUri } from '../../../../src/mcp/utils/uri';
import { toMcpContent } from '../../../../src/mcp/translation/project';
import { createTask } from '../../../mocks/factories/task';
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
      it('should convert project to markdown content', async () => {
        const project = createProject({
          id: 123,
          title: 'Test Project',
          description: 'Project Description',
        });
        project.listTasks = jest.fn().mockResolvedValue([]);

        const content = await toMcpContent(project);
        expect(content).toContain('# Test Project');
        expect(content).toContain('Project Description');
      });

      it('should include archived status', async () => {
        const project = createProject({
          id: 123,
          title: 'Test Project',
          is_archived: true,
        });
        project.listTasks = jest.fn().mockResolvedValue([]);

        const content = await toMcpContent(project);
        expect(content).toContain('# Test Project');
        expect(content).toContain('(ARCHIVED)');
      });

      it('should include tasks when available', async () => {
        const project = createProject({
          id: 123,
          title: 'Test Project',
        });
        project.listTasks = jest
          .fn()
          .mockResolvedValue([
            createTask({ id: 1, title: 'Task 1', done: false }),
            createTask({ id: 2, title: 'Task 2', done: true }),
          ]);

        const content = await toMcpContent(project);
        expect(content).toContain('## Tasks');
        expect(content).toContain('- [ ] [Task 1](vikunja://tasks/1)');
        expect(content).toContain('- [x] [Task 2](vikunja://tasks/2)');
      });
    });

    describe('Project List', () => {
      const mockProjects = [
        createProject({ id: 1, title: 'Project 1' }),
        createProject({ id: 2, title: 'Project 2' }),
        createProject({ id: 3, title: 'Project with [special] *chars*' }),
      ];

      it('should render projects as markdown list with links', async () => {
        const result = await toMcpContent(mockProjects);
        expect(result).toContain('- [Project 1](vikunja://projects/1)');
        expect(result).toContain('- [Project 2](vikunja://projects/2)');
        expect(result).toContain(
          '- [Project with \\[special\\] \\*chars\\*](vikunja://projects/3)'
        );
      });

      it('should handle empty list', async () => {
        expect(await toMcpContent([])).toBe('');
      });
    });
  });
});
