# OpenAPI Generated Types

These types are automatically generated from the Vikunja OpenAPI specification.

## How they are generated

The types are generated using:

1. `swagger2openapi` to convert the Swagger spec to OpenAPI 3.0
2. `openapi-typescript` to generate TypeScript types

The generation script is located in `scripts/generate-types.sh`.

## How to update

To update the types after API changes:

```bash
npm run generate-types
```

## Usage

Import types from the main types index file:

```typescript
import { Task, Project, User } from '../types';
```

Do not import directly from this directory as the types are regenerated and may change structure.
