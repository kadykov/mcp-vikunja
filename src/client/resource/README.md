# Resource Layer

The resource layer provides a higher-level, resource-oriented abstraction over the HTTP client layer. It organizes API operations around domain entities (resources) rather than HTTP endpoints.

## Design Pattern

The resource layer follows these key patterns:

1. **Base Resource**

   - Generic type-safe base class
   - Standard CRUD operations
   - Common error handling
   - Consistent response handling

2. **Resource-Specific Implementations**

   - Type-safe interfaces for each resource
   - Data transformation from API to domain types
   - Resource-specific validations
   - Custom error handling

3. **Type Transformations**
   - Convert API responses to domain types
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

// Create a resource instance
const taskResource = new TaskResource(client);

// Use type-safe methods
const task = await taskResource.get(123);
const newTask = await taskResource.create({
  title: 'New Task',
  description: 'Task Description',
  project_id: 1,
});
```

## Resource Structure

```typescript
// Resource interface with proper types
export interface ITaskResource {
  get(id: number): Promise<Task>;
  create(data: CreateTask): Promise<Task>;
  update(id: number, data: UpdateTask): Promise<Task>;
  delete(id: number): Promise<void>;
  list(projectId: number): Promise<Task[]>;
}

// Implementation with data transformation
export class TaskResource extends BaseResource<Task> implements ITaskResource {
  private transformTask(vikunjaTask: VikunjaTask): Task {
    // Validate required fields
    if (!vikunjaTask.id || !vikunjaTask.title) {
      throw new Error('Invalid task data: missing required fields');
    }

    // Transform with defaults
    return {
      id: vikunjaTask.id,
      title: vikunjaTask.title,
      description: vikunjaTask.description ?? '',
      // ... other fields
    };
  }

  async get(id: number): Promise<Task> {
    const response = await this.client.get<VikunjaTask>(`/tasks/${id}`);
    return this.transformTask(response);
  }
}
```

## Testing Resources

Each resource has comprehensive tests that:

1. **Type Safety**

   - Validate API response transformations
   - Test required field handling
   - Check default values
   - Verify error cases

2. **Data Validation**

   - Test missing required fields
   - Validate field transformations
   - Check error response handling
   - Test edge cases

3. **Test Utilities**
   - Factory functions for test data
   - Response creators for MSW
   - Type-safe error responses
   - Shared test helpers

Example test:

```typescript
test('should transform API response to domain type', async () => {
  const vikunjaTask = createVikunjaTask({
    id: 123,
    title: 'Test Task',
  });

  server.use(
    http.get('${API_BASE}/tasks/123', () => {
      return createTaskResponse(vikunjaTask);
    })
  );

  const result = await taskResource.get(123);
  expect(result).toMatchObject({
    id: 123,
    title: 'Test Task',
    description: '', // Default value
  });
});
```

## Error Handling

Resources handle errors in a consistent way:

1. **Validation Errors**

   - Missing required fields
   - Invalid data types
   - Resource-specific validations

2. **API Errors**

   - Not found errors
   - Permission errors
   - Server errors

3. **Type-Safe Error Responses**
   - Consistent error format
   - Resource-specific error codes
   - Descriptive error messages

## Future Extensions

- Pagination support
- Filtering and sorting
- Resource relationships
- Caching
- Optimistic updates
- Batch operations
- Real-time updates
