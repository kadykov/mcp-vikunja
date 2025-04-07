# OpenAPI Generated Types

These types are automatically generated from the Vikunja OpenAPI specification.

## How they are generated

The types are generated using:

1. `swagger2openapi` to convert the Swagger spec to OpenAPI 3.0
2. `openapi-typescript` to generate TypeScript types

The generation script is located in `scripts/generate-types.sh`.

## Type System Organization

Our type system is organized in layers:

1. **Raw API Types** (VikunjaXXX)

   - Generated from OpenAPI spec
   - Represent exact API response shapes
   - Have optional fields matching API spec
   - Example: `VikunjaTask`, `VikunjaProject`

2. **Domain Types** (XXX)

   - Class implementations with methods
   - Required fields enforced via constructor
   - Default values applied
   - HTTP client operations included
   - Example: `Task` (implementation of `TaskImpl`), `Project` (implementation of `ProjectImpl`)

3. **Operation Types** (CreateXXX, UpdateXXX)
   - Types for specific operations
   - Only include relevant fields
   - Proper optionality based on operation
   - Example: `CreateTask`, `UpdateProject`

## Type Transformations

Resource implementations handle transforming between API and domain types:

```typescript
// API Response (VikunjaTask)
{
  id?: number,
  title?: string,
  // ... other optional fields
}

// Domain Implementation (TaskImpl)
class TaskImpl {
  constructor(client: VikunjaHttpClient, data: VikunjaTask) {
    // Validates required fields
    // Sets up HTTP client
  }

  // Methods
  update(data: UpdateTask): Promise<void>
  delete(): Promise<void>
  // ... other methods

  // Getters ensure non-null values
  get id(): number
  get title(): string
  // ... other properties
}
```

## Usage

Import domain implementations from the main types index file:

```typescript
import { Task, Project } from '../types';

// Full implementation with methods
const task = await Task.get(client, id);
await task.update({ title: 'New Title' });
```

For API types (when needed):

```typescript
import type { VikunjaTask, VikunjaProject } from '../types';
```

Do not import directly from this directory as the types are regenerated and may change structure.

## Type Safety

- API responses are validated in constructors
- Required fields are checked at runtime
- Proper error handling for missing/invalid data
- Getters ensure non-null values
- Type guards ensure data integrity

Example implementation:

```typescript
class TaskImpl {
  constructor(client: VikunjaHttpClient, data: VikunjaTask) {
    if (!data.id || !data.title || !data.created || !data.updated) {
      throw new Error('Invalid task data: missing required fields');
    }
    this.client = client;
    this.data = data;
  }

  get title(): string {
    return this.data.title!; // Safe because constructor validates
  }
}
```
