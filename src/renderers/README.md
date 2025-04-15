# Renderers System

The renderers system provides a flexible and extensible way to format MCP resources in different output formats, starting with Markdown.

## Architecture

```mermaid
graph TD
    subgraph Interfaces
        IR[IRenderer]
        IMR[IMarkdownRenderer]
    end

    subgraph Base Classes
        BMR[BaseMarkdownRenderer]
    end

    subgraph Implementations
        PMR[ProjectMarkdownRenderer]
        TMR[TaskMarkdownRenderer]
        LMR[LabelMarkdownRenderer]
    end

    IR --> IMR
    IMR --> BMR
    BMR --> PMR
    BMR --> TMR
    BMR --> LMR
    TMR -.-> LMR[Uses]
```

## Components

### Core Interfaces

- `IRenderer<T>`: Base interface for all renderers

  - `render(data: T): Promise<string>` - Render a single item
  - `renderList(items: T[]): Promise<string>` - Render a list of items

- `IMarkdownRenderer<T>`: Markdown-specific renderer interface
  - Extends `IRenderer<T>`
  - Adds `renderAsListItem(item: T): Promise<string>`
  - Optional `renderAsTree?(item: T): Promise<string>`

### Base Classes

- `BaseMarkdownRenderer<T>`: Abstract base class for Markdown renderers
  - Implements common functionality
  - Provides default list rendering behavior
  - Enforces consistent Markdown formatting

### Entity Renderers

- `ProjectMarkdownRenderer`: Renders Project entities

  - List items as links to projects
  - Full JSON for single project view (temporary)
  - Future: Rich Markdown for single project view

- `TaskMarkdownRenderer`: Renders Task entities

  - List items in GitHub task list format (- [ ] / - [x])
  - Task titles as links with proper Markdown escaping
  - Full details including due dates, labels, and assignees
  - Uses LabelMarkdownRenderer for label formatting

- `LabelMarkdownRenderer`: Renders Label entities
  - Hashtag format (#label-name)
  - Sanitizes label text (strips special chars, replaces spaces)
  - Optional description in full render mode

### Utilities

- `markdown-helpers.ts`: Common Markdown formatting utilities
  - `escapeMarkdown(text: string): string`
  - `createLink(text: string, url: string): string`
  - `createListItem(text: string, level?: number): string`
  - `createHeading(text: string, level?: number): string`
  - `createCodeBlock(text: string, language?: string): string`

## URI Handling

Renderers use the MCP URI system to create resource links:

```typescript
import { createUri } from '../../mcp/uri';

class TaskMarkdownRenderer extends BaseMarkdownRenderer<Task> {
  async renderAsListItem(task: Task): Promise<string> {
    const taskLink = createLink(
      escapeMarkdown(task.title),
      createUri('tasks', task.id) // Creates: vikunja://tasks/123
    );
    return `- [ ] ${taskLink}`;
  }
}

class ProjectMarkdownRenderer extends BaseMarkdownRenderer<Project> {
  async renderAsListItem(project: Project): Promise<string> {
    const projectLink = createLink(
      escapeMarkdown(project.title),
      createUri('projects', project.id) // Creates: vikunja://projects/123
    );
    return `- ${projectLink}`;
  }
}
```

Each renderer:

1. Uses type-safe `createUri` for URI generation
2. Properly escapes content before using in URIs
3. Creates consistent resource links across the application

## Output Examples

```typescript
// Project rendering
const projectRenderer = new ProjectMarkdownRenderer();
const markdown = await projectRenderer.render(project);
// Output:
// # Project Title
//
// Project description here...
//
// ## Tasks
// - [ ] [Task One](vikunja://tasks/1)
// - [x] [Task Two](vikunja://tasks/2)

// Task rendering with labels
const taskRenderer = new TaskMarkdownRenderer();
const taskMarkdown = await taskRenderer.render(task);
// Output:
// # Task Title
// - [ ] Due: 2025-12-31
//
// Task description here...
// Progress: 75%
// #important #in-progress
// Assigned to: @user1, @user2
```

## Asynchronous Design

All renderers use async/await to support operations that may require asynchronous data fetching:

1. **All Methods Return Promises**: Every rendering method returns a Promise

   ```typescript
   render(data: T): Promise<string>
   renderList(items: T[]): Promise<string>
   renderAsListItem(item: T): Promise<string>
   ```

2. **Async Data Fetching**: Some renderers need to fetch related data

   ```typescript
   // ProjectMarkdownRenderer
   async render(project: Project): Promise<string> {
     // ... other rendering ...
     const tasks = await project.listTasks();
     // ... render tasks ...
   }
   ```

3. **Error Propagation**: Async errors are propagated to the caller
   - No internal error handling in renderers
   - Caller responsible for handling data fetch errors
   - Clear error boundaries and responsibilities

## Markdown Escaping Strategy

The renderers follow a consistent strategy for handling Markdown special characters:

1. **Utility Functions**: Base utilities like `createLink`, `createHeading`, etc. do not perform escaping

   ```typescript
   createLink('Text with *stars*', 'url'); // -> [Text with *stars*](url)
   ```

2. **Explicit Escaping**: The `escapeMarkdown` utility handles special characters:

   ```typescript
   escapeMarkdown('Text with *stars*'); // -> Text with \*stars\*
   ```

3. **Renderer Responsibility**: Each renderer is responsible for escaping its content:
   ```typescript
   // In TaskMarkdownRenderer:
   const title = task.title;
   const taskLink = createLink(escapeMarkdown(title), toMcpUri(task.id));
   ```

This approach ensures:

- Clear responsibility for escaping
- No double-escaping issues
- Consistent rendering across the application

## Future Extensions

1. Rich project rendering

   - Description as body text
   - Tasks as checklist
   - Child projects as tree

2. Additional formats
   - HTML renderer
   - Plain text renderer
   - Custom format renderers

## Design Decisions

1. Separate rendering from data access

   - Clean separation of concerns
   - Independent testing
   - Format-agnostic resources

2. Composition over inheritance

   - Base renderer + utilities
   - Easy to add new formats
   - Reusable components

3. Strong typing
   - Generic interfaces
   - Type-safe rendering
   - Clear contracts
