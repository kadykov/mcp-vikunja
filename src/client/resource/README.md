# Resource Layer

The resource layer provides a higher-level, resource-oriented abstraction over the HTTP client layer. It organizes API operations around domain entities (resources) rather than HTTP endpoints.

## Design Pattern

The resource layer uses an object-oriented approach with these key patterns:

1. **Domain Objects**

   - Type-safe classes for each resource type
   - Private constructors to ensure data validity
   - Static factory methods for object creation
   - Instance methods for operations
   - Getters for data access

2. **Resource Factories**

   - Convenient access through resource classes
   - Client management
   - CRUD operations
   - Type-safe interfaces

3. **Type Transformations**
   - Convert API responses to domain objects
   - Handle missing or optional fields
   - Apply default values
   - Validate required fields

## Example Usage

```typescript
// Create a client
const client = new VikunjaHttpClient({
  config: {
    apiUrl: 'https://app.vikunja.cloud/',
    token: 'user-token',
  },
});

// Using resource factories (recommended)
const projectResource = new ProjectResource(client);
const taskResource = new TaskResource(client);

// Create and get projects
const project = await projectResource.create({
  title: 'New Project',
  description: 'Project Description',
});

const projects = await projectResource.list();
const singleProject = await projectResource.get(123);

// Create tasks in a project
const task = await project.createTask({
  title: 'New Task',
  description: 'Task Description',
});

// List tasks in a project
const projectTasks = await project.listTasks();

// Get all tasks
const allTasks = await taskResource.list();
const singleTask = await taskResource.get(456);

// Update and delete
await project.update({
  title: 'Updated Project',
});

await task.update({
  title: 'Updated Task',
});

await task.delete();
await project.delete();
```

## Resource Structure

```typescript
// Resource implementation with OOP pattern
export class Project implements ProjectType {
  // Private constructor ensures data validity
  private constructor(client: VikunjaHttpClient, data: VikunjaProject) {
    // Validate required fields
    if (!data.id || !data.title) {
      throw new Error('Invalid project data');
    }
  }

  // Factory methods
  static async create(client: VikunjaHttpClient, data: CreateProject): Promise<Project>;
  static async get(client: VikunjaHttpClient, id: number): Promise<Project>;
  static async list(client: VikunjaHttpClient): Promise<Project[]>;

  // Instance methods
  async update(data: UpdateProject): Promise<void>;
  async delete(): Promise<void>;

  // Task-related methods
  async createTask(data: CreateTask): Promise<Task>;
  async listTasks(): Promise<Task[]>;

  // Data getters
  get id(): number;
  get title(): string;
  get description(): string;
  // ... other getters
}

// Resource factory for convenient access
export class ProjectResource {
  constructor(private client: VikunjaHttpClient) {}

  create(data: CreateProject): Promise<Project>;
  get(id: number): Promise<Project>;
  list(): Promise<Project[]>;
}
```

## Testing Resources

Each resource has comprehensive tests that verify:

1. **Object Creation**

   - Factory method behavior
   - Required field validation
   - Default value handling
   - Type safety

2. **Instance Operations**

   - Method behavior
   - Data updates
   - Error handling
   - Resource relationships

3. **Test Utilities**
   - Factory functions for test data
   - Response creators for MSW
   - Type-safe error responses
   - Shared test helpers

Example test:

```typescript
describe('Project', () => {
  it('should create a project', async () => {
    const projectResource = new ProjectResource(client);
    const project = await projectResource.create({
      title: 'Test Project',
      description: 'Test Description',
    });

    expect(project.title).toBe('Test Project');
    expect(project.description).toBe('Test Description');

    // Create a task in the project
    const task = await project.createTask({
      title: 'Test Task',
      description: 'Task Description',
    });

    expect(task.project_id).toBe(project.id);
    expect(task.title).toBe('Test Task');
  });
});
```

## Error Handling

Resources handle errors through:

1. **Validation**

   - Constructor validation of required fields
   - Method parameter validation
   - Type checking

2. **API Errors**

   - Not found errors
   - Permission errors
   - Server errors

3. **Type Safety**
   - Compile-time type checking
   - Runtime data validation
   - Consistent error types

## Future Extensions

- Pagination support
- Filtering and sorting
- Resource relationships
- Caching
- Optimistic updates
- Batch operations
- Real-time updates
