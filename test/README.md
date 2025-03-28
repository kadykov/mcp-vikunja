# Testing Setup

This directory contains the test setup for the Vikunja MCP project.

## Structure

```
test/
├── __tests__/        # Test files
│   ├── client/       # API client tests
│   ├── config/       # Configuration tests
│   └── validation/   # Validation tests
├── mocks/            # MSW mocking setup
│   ├── factories.ts  # Test data factories
│   ├── handlers.ts   # MSW request handlers
│   ├── index.ts      # Mock exports
│   ├── server.ts     # MSW server setup
│   └── types.ts      # Mock type definitions
├── utils/            # Test utilities
│   └── test-helpers.ts
├── setup.ts          # Jest setup file
└── README.md         # This file
```

## Mock Service Worker (MSW)

We use MSW to intercept and mock API requests during tests. The setup includes:

- Type-safe request handlers based on OpenAPI types
- Factory functions for generating test data
- Consistent error handling
- Utility functions for testing API responses

### Usage

```typescript
import { server } from '../mocks/server';
import { http } from 'msw';
import { factories } from '../mocks/index';
import { apiFetch, expectApiError } from '../utils/test-helpers';

// Test successful response
const result = await apiFetch<Project>('/projects/123');

// Test error response
await expectApiError(apiFetch('/projects/999'), 404, 'Project not found');

// Override handler for specific test
server.use(
  http.get('/api/v1/projects/:id', () => {
    return Response.json({
      data: factories.createProject(),
      status: 200,
    });
  })
);
```

### Test Data Factories

Use factory functions to create test data:

```typescript
import { factories } from '../mocks/index';

const testProject = factories.createProject({
  title: 'Custom Title',
});

const testTask = factories.createTask({
  project_id: testProject.id,
});
```

### Test Helpers

Common test utilities:

- `apiFetch`: Typed fetch wrapper
- `apiPut/apiPost`: Typed request helpers
- `expectApiError`: Error response assertions
- `testData`: Common path builders

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```
