import { TaskMarkdownRenderer } from '../../../../src/renderers/markdown/TaskMarkdownRenderer';
import { createTask } from '../../../mocks/factories/task';
import { createLabel } from '../../../mocks/factories/label';
import { createUser } from '../../../mocks/factories/user';
import { createUri } from '../../../../src/mcp/uri';
import { escapeMarkdown } from '../../../../src/renderers/utils/markdown-helpers';

describe('TaskMarkdownRenderer', () => {
  const renderer = new TaskMarkdownRenderer();

  const mockLabel1 = createLabel({ id: 1, title: 'Priority' });
  const mockLabel2 = createLabel({ id: 2, title: 'In Progress' });
  const mockUser1 = createUser({ id: 1, username: 'alice' });
  const mockUser2 = createUser({ id: 2, username: 'bob' });

  const mockTask = createTask({
    id: 1,
    title: 'Test Task',
    description: 'A test task',
    done: false,
    due_date: '2025-12-31',
    percent_done: 50,
    labels: [mockLabel1, mockLabel2],
    assignees: [mockUser1, mockUser2],
  });

  describe('renderAsListItem', () => {
    it('should render an incomplete task as a markdown list item with link', async () => {
      const result = await renderer.renderAsListItem(mockTask);
      expect(result).toBe(
        `- [ ] [Test Task](${createUri('tasks', mockTask.id)}) #priority #in-progress`
      );
    });

    it('should render a completed task as a markdown list item with checkbox', async () => {
      const completedTask = createTask({ id: 2, title: 'Done Task', done: true, labels: [] });
      const result = await renderer.renderAsListItem(completedTask);
      expect(result).toBe(`- [x] [Done Task](${createUri('tasks', completedTask.id)})`);
    });

    it('should handle special characters in task title', async () => {
      const taskWithSpecialChars = createTask({
        id: 3,
        title: 'Task with [special] *chars*',
        labels: [],
      });
      const result = await renderer.renderAsListItem(taskWithSpecialChars);
      expect(result).toBe(
        `- [ ] [Task with \\[special\\] \\*chars\\*](${createUri('tasks', taskWithSpecialChars.id)})`
      );
    });
  });

  describe('render', () => {
    it('should render a task with all details', async () => {
      const result = await renderer.render(mockTask);
      const expected = [
        '# Test Task',
        '- [ ] Due: 2025-12-31',
        '',
        'A test task',
        '',
        'Progress: 50%',
        '',
        '#priority #in-progress',
        '',
        'Assigned to: @alice, @bob',
      ].join('\n');
      expect(result).toBe(expected);
    });

    it('should handle task without optional fields', async () => {
      const simpleTask = createTask({
        id: 5,
        title: 'Simple Task',
        description: '',
        done: false,
        labels: [],
      });
      const expected = ['# Simple Task', '- [ ] No due date'].join('\n');
      expect(await renderer.render(simpleTask)).toBe(expected);
    });

    it('should handle completed task', async () => {
      const completedTask = createTask({
        id: 6,
        title: 'Done Task',
        done: true,
        labels: [],
      });
      expect(await renderer.render(completedTask)).toContain('- [x] No due date');
    });
  });

  describe('renderList', () => {
    const mockTasks = [
      createTask({ id: 1, title: 'Task 1', labels: [] }),
      createTask({ id: 2, title: 'Task 2', done: true, labels: [] }),
    ];

    it('should render multiple tasks as a markdown list', async () => {
      const result = await renderer.renderList(mockTasks);
      const expected = mockTasks
        .map(
          t => `- [${t.done ? 'x' : ' '}] [${escapeMarkdown(t.title)}](${createUri('tasks', t.id)})`
        )
        .join('\n');
      expect(result).toBe(expected);
    });

    it('should handle empty list', async () => {
      const result = await renderer.renderList([]);
      expect(result).toBe('');
    });
  });
});
