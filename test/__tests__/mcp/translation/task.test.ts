import { toMcpUri, fromMcpUri } from '../../../../src/mcp/utils/uri';
import { toMcpContent } from '../../../../src/mcp/translation/task';
import { createTask } from '../../../mocks/factories/task';
import { createLabel } from '../../../mocks/factories/label';
import { createUser } from '../../../mocks/factories/user';

describe('Task Translation', () => {
  describe('URI Mapping', () => {
    it('should convert task ID to MCP URI', () => {
      const taskId = 123;
      const uri = toMcpUri(taskId);
      expect(uri).toBe('vikunja://tasks/123');
    });

    it('should extract task ID from MCP URI', () => {
      const uri = 'vikunja://tasks/123';
      const taskId = fromMcpUri(uri);
      expect(taskId).toBe(123);
    });

    it('should throw error for invalid MCP URI', () => {
      const invalidUris = [
        'invalid://tasks/123',
        'vikunja://invalid/123',
        'vikunja://tasks/abc',
        'vikunja://tasks/',
        'vikunja://tasks',
      ];

      invalidUris.forEach(uri => {
        expect(() => fromMcpUri(uri)).toThrow('Invalid MCP task URI format');
      });
    });
  });

  describe('Content Conversion', () => {
    describe('Single Task', () => {
      const mockLabel = createLabel({ id: 1, title: 'Priority' });
      const mockUser = createUser({ id: 1, username: 'testuser' });

      it('should convert task to markdown content', async () => {
        const task = createTask({
          id: 123,
          title: 'Test Task',
          description: 'Task Description',
          done: false,
          due_date: '2025-12-31',
        });

        const content = await toMcpContent(task);
        expect(content).toContain('# Test Task');
        expect(content).toContain('Task Description');
        expect(content).toContain('Due: 2025-12-31');
      });

      it('should handle completed tasks', async () => {
        const task = createTask({
          id: 123,
          title: 'Done Task',
          done: true,
        });

        const content = await toMcpContent(task);
        expect(content).toContain('# Done Task');
        expect(content).toContain('- [x]');
      });

      it('should include labels and assignees', async () => {
        const task = createTask({
          id: 123,
          title: 'Full Task',
          labels: [mockLabel],
          assignees: [mockUser],
        });

        const content = await toMcpContent(task);
        expect(content).toContain('#priority');
        expect(content).toContain('@testuser');
      });
    });

    describe('Task List', () => {
      const mockTasks = [
        createTask({ id: 1, title: 'Task 1', done: false }),
        createTask({ id: 2, title: 'Task 2', done: true }),
        createTask({ id: 3, title: 'Task with [special] *chars*', done: false }),
      ];

      it('should render tasks as markdown checklist with links', async () => {
        const result = await toMcpContent(mockTasks);
        expect(result).toContain('- [ ] [Task 1](vikunja://tasks/1)');
        expect(result).toContain('- [x] [Task 2](vikunja://tasks/2)');
        expect(result).toContain('- [ ] [Task with \\[special\\] \\*chars\\*](vikunja://tasks/3)');
      });

      it('should handle empty list', async () => {
        expect(await toMcpContent([])).toBe('');
      });
    });
  });
});
