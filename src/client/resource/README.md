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
- Additional resource-specific methods
- Domain-specific error handling
- Resource validation

## Example Usage

```typescript
// Create a client
const client = new VikunjaHttpClient({
  /*...*/
});

// Create a resource instance
const projectResource = new ProjectResource(client);

// Use type-safe methods
const project = await projectResource.get(123);
const newProject = await projectResource.create({
  title: 'New Project',
  description: 'Project Description',
});
```

## Testing

Each resource has comprehensive tests that:

- Cover all CRUD operations
- Handle error cases
- Validate responses
- Use MSW for API mocking
- Reuse existing test infrastructure

## Resource Structure

```typescript
export interface IResource<T> {
  get(id: number): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

export class BaseResource<T> implements IResource<T> {
  constructor(protected client: VikunjaHttpClient) {}
  // ... implementation
}

export class ProjectResource extends BaseResource<Project> {
  // Project-specific implementation
}
```

## Future Extensions

- Pagination support
- Filtering and sorting
- Resource relationships
- Caching
- Optimistic updates
