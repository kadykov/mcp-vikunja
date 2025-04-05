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

   - Our internal representation
   - Required fields are enforced
   - Default values are applied
   - Example: `Task`, `Project`

3. **Operation Types** (CreateXXX, UpdateXXX)
   - Types for specific operations
   - Only include relevant fields
   - Proper optionality based on operation
   - Example: `CreateTask`, `UpdateProject`

## Type Transformations

Resources handle transforming between API and domain types:

```typescript
// API Response (VikunjaTask)
{
  id?: number,
  title?: string,
  // ... other optional fields
}

// Domain Type (Task)
{
  id: number,         // Required
  title: string,      // Required
  description: string // Defaults applied
  // ... other fields with proper types
}
```

## Usage

Import domain types from the main types index file:

```typescript
import type { Task, Project, User } from '../types';
```

For API types (when needed):

```typescript
import type { VikunjaTask, VikunjaProject } from '../types';
```

Do not import directly from this directory as the types are regenerated and may change structure.

## Type Safety

- API responses are validated using resource transformers
- Required fields are checked at runtime
- Proper error handling for missing/invalid data
- Type guards ensure data integrity

Example transformation:

```typescript
private transformTask(vikunjaTask: VikunjaTask): Task {
  if (!vikunjaTask.id || !vikunjaTask.title) {
    throw new Error('Invalid task data: missing required fields');
  }

  return {
    id: vikunjaTask.id,
    title: vikunjaTask.title,
    description: vikunjaTask.description ?? '',
    // ... other fields with proper defaults
  };
}
```
