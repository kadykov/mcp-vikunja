import { createResourceHandler } from '../../../../src/mcp/resources/index';
import { NotFoundError } from '../../../../src/client/http/errors';
import { createProject } from '../../../mocks/factories/project';
import { createTask } from '../../../mocks/factories/task';
import { VikunjaHttpClient } from '../../../../src/client/http/client';
import { uriTemplate } from '../../../../src/mcp/uri';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { Request, Notification, RequestId } from '@modelcontextprotocol/sdk/types.js';
import { ProjectResource } from '../../../../src/client/resource/project';
import { TaskResource } from '../../../../src/client/resource/task';

// Mock renderer modules
jest.mock('../../../../src/renderers/markdown/ProjectMarkdownRenderer', () => {
  return {
    ProjectMarkdownRenderer: function (): { render: jest.Mock } {
      return {
        render: jest.fn().mockResolvedValue('# Test Project'),
      };
    },
  };
});

jest.mock('../../../../src/renderers/markdown/TaskMarkdownRenderer', () => {
  return {
    TaskMarkdownRenderer: function (): { render: jest.Mock } {
      return {
        render: jest.fn().mockResolvedValue('# Test Task'),
      };
    },
  };
});

// Mock resource classes
jest.mock('../../../../src/client/resource/project');
jest.mock('../../../../src/client/resource/task');

describe('Resource Handler', () => {
  // Mock resource instances
  const mockProjectGet = jest.fn();
  const mockTaskGet = jest.fn();

  // Mock resource constructors
  (ProjectResource as jest.Mock).mockImplementation(() => ({
    get: mockProjectGet,
  }));
  (TaskResource as jest.Mock).mockImplementation(() => ({
    get: mockTaskGet,
  }));

  // Create a basic mock client - actual implementation is created in resource classes
  const mockClient = {} as VikunjaHttpClient;
  const abortController = new AbortController();
  const handler = createResourceHandler(mockClient);
  const mockExtra: RequestHandlerExtra<Request, Notification> = {
    signal: abortController.signal,
    requestId: 'test-123' as RequestId,
    sendNotification: jest.fn(),
    sendRequest: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Project Resource', () => {
    const mockProject = createProject({ id: 123, title: 'Test Project' });
    const mockRenderedContent = '# Test Project';

    beforeEach(() => {
      mockProjectGet.mockResolvedValue(mockProject);
    });

    it('should handle project resource', async () => {
      const uri = new URL('vikunja://projects/123');
      const variables = { resource: 'projects', id: '123' };

      const result = await handler(uri, variables, mockExtra);

      expect(result.contents).toHaveLength(1);
      expect(result.contents[0]).toEqual({
        uri: uri.href,
        text: mockRenderedContent,
        mimeType: 'text/markdown',
      });
      expect(mockProjectGet).toHaveBeenCalledWith(123);
    });

    it('should handle project fetching error', async () => {
      const uri = new URL('vikunja://projects/123');
      const variables = { resource: 'projects', id: '123' };

      mockProjectGet.mockRejectedValue(
        new NotFoundError({ code: 404, message: 'Project not found' })
      );

      await expect(handler(uri, variables, mockExtra)).rejects.toThrow(
        'Vikunja error: Project not found'
      );
    });
  });

  describe('Task Resource', () => {
    const mockTask = createTask({ id: 456, title: 'Test Task' });
    const mockRenderedContent = '# Test Task';

    beforeEach(() => {
      mockTaskGet.mockResolvedValue(mockTask);
    });

    it('should handle task resource', async () => {
      const uri = new URL('vikunja://tasks/456');
      const variables = { resource: 'tasks', id: '456' };

      const result = await handler(uri, variables, mockExtra);

      expect(result.contents).toHaveLength(1);
      expect(result.contents[0]).toEqual({
        uri: uri.href,
        text: mockRenderedContent,
        mimeType: 'text/markdown',
      });
      expect(mockTaskGet).toHaveBeenCalledWith(456);
    });

    it('should handle task fetching error', async () => {
      const uri = new URL('vikunja://tasks/456');
      const variables = { resource: 'tasks', id: '456' };

      mockTaskGet.mockRejectedValue(new NotFoundError({ code: 404, message: 'Task not found' }));

      await expect(handler(uri, variables, mockExtra)).rejects.toThrow(
        'Vikunja error: Task not found'
      );
    });
  });

  describe('Invalid Resource Type', () => {
    it('should throw error for unknown resource type', async () => {
      const uri = new URL('vikunja://invalid/123');
      const variables = { resource: 'invalid', id: '123' };

      await expect(handler(uri, variables, mockExtra)).rejects.toThrow(
        'Invalid resource type: invalid'
      );
    });

    it('should handle resource type as array', async () => {
      const uri = new URL('vikunja://projects/123');
      const variables = { resource: ['projects'], id: '123' };

      const mockProject = createProject({ id: 123 });
      const mockRenderedContent = '# Test Project';

      mockProjectGet.mockResolvedValue(mockProject);

      const result = await handler(uri, variables, mockExtra);
      expect(result.contents[0].text).toBe(mockRenderedContent);
    });

    it('should handle id as array', async () => {
      const uri = new URL('vikunja://projects/123');
      const variables = { resource: 'projects', id: ['123'] };

      const mockProject = createProject({ id: 123 });
      const mockRenderedContent = '# Test Project';

      mockProjectGet.mockResolvedValue(mockProject);

      const result = await handler(uri, variables, mockExtra);
      expect(result.contents[0].text).toBe(mockRenderedContent);
    });
  });

  describe('URI Template', () => {
    it('should match MCP template format', () => {
      expect(uriTemplate.toString()).toBe('vikunja://{resource}/{id}');
    });

    it('should parse project URI correctly', () => {
      const uri = 'vikunja://projects/123';
      const vars = uriTemplate.match(uri);
      expect(vars?.resource).toBe('projects');
      expect(vars?.id).toBe('123');
    });

    it('should parse task URI correctly', () => {
      const uri = 'vikunja://tasks/456';
      const vars = uriTemplate.match(uri);
      expect(vars?.resource).toBe('tasks');
      expect(vars?.id).toBe('456');
    });
  });
});
