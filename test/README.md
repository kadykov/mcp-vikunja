# Testing Setup

This directory contains the test setup for the Vikunja MCP project.

## Structure

```
test/
├── __tests__/        # Test files
│   ├── client/       # API client tests
│   ├── config/       # Configuration tests
│   ├── integration/  # Integration tests
│   └── validation/   # Validation tests
├── mocks/            # MSW mocking setup
│   ├── factories/    # Resource-specific test data factories
│   ├── server.ts     # MSW server setup
│   └── types.ts      # Mock type definitions
├── utils/            # Test utilities
│   ├── test-utils.ts      # Test response creators
│   ├── test-responses.ts  # Response utilities
│   └── vikunja-test-helpers.ts
├── setup.ts          # Jest setup file
└── README.md         # This file
```

## Testing Strategies

### 1. Unit Tests with MSW

We use MSW to intercept and mock API requests during unit tests:

- Type-safe request handlers based on OpenAPI types
- Factory functions for generating test data
- Consistent error handling
- Response transformation testing
- Default value validation

#### Response Utilities and Type Safety

```typescript
// Create type-safe test responses
const response = createTaskResponse(vikunjaTask);
const listResponse = createTaskListResponse(vikunjaTasks);
const errorResponse = createTaskErrorResponse('not_found');

// Test data transformations
test('should transform API response', async () => {
  const vikunjaTask = createVikunjaTask({
    id: 123,
    title: 'Test Task',
  });

  server.use(
    http.get(`${API_BASE}/tasks/123`, () => {
      return createTaskResponse(vikunjaTask);
    })
  );

  const result = await taskResource.get(123);
  expect(result).toMatchObject({
    id: vikunjaTask.id,
    title: vikunjaTask.title,
    description: '', // Default value
  });
});
```

#### MSW Usage

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

### 2. Integration Tests with Real Vikunja Instance

Integration tests interact with a real Vikunja instance to verify actual API behavior:

```typescript
import { createTestUser } from '../../utils/vikunja-test-helpers';
import { createTestProject, cleanupTestData } from '../../utils/mcp-test-helpers';
import { ProjectResource } from '../../../src/client/resource/project';

describe('Project Resource Integration Tests', () => {
  let testUser;
  let projectResource;

  beforeAll(async () => {
    // Setup test user and resource
    testUser = await createTestUser();
    projectResource = new ProjectResource({
      apiUrl: 'http://vikunja:3456/api/v1',
      token: testUser.token,
    });
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData(testUser.token, 'project-test');
  });

  test('should perform CRUD operations', async () => {
    // Test real API interactions using scoped test data
    const project = await createTestProject(testUser.token, 'project-test');
    expect(project.title).toContain('[project-test]'); // Projects are scoped
  });
});
```

#### Integration Test Infrastructure and Scoping

1. Test Data Scoping Pattern

   ```typescript
   // Create scoped test project
   const project = await createTestProject(token, 'my-test-scope');

   // Clean up only projects with matching scope
   await cleanupTestData(token, 'my-test-scope');
   ```

2. Parallel Test Safety

   - Each test file uses its own scope for test data
   - Prevents test interference when running in parallel
   - Automatic cleanup of scoped test data
   - Example scopes: 'project-test', 'task-test', 'mcp-e2e'

3. User Management Pattern

   ```typescript
   // test/utils/vikunja-test-helpers.ts
   export async function createTestUser() {
     const credentials = {
       username: 'mcp-test-user',
       email: 'mcp-test@example.com',
       password: 'test-password-123',
     };

     // Register or reuse existing user
     try {
       await register(credentials);
     } catch (error) {
       // User might already exist
     }

     // Login and get token
     return login(credentials);
   }
   ```

### Test Data Factories and Type Safety

Our factory functions ensure type-safe test data:

```typescript
// Basic usage
const task = createVikunjaTask();

// Override specific fields
const customTask = createVikunjaTask({
  id: 123,
  title: 'Custom Title',
});

// Test data relationships
const project = createVikunjaProject();
const projectTask = createVikunjaTask({
  project_id: project.id,
});
```

Each factory:

- Provides sensible defaults
- Ensures required fields
- Maintains relationships
- Validates field types

### Test Helpers

Common test utilities:

#### Response Utilities (`test-utils.ts`)

```typescript
// Success responses
const response = createTaskResponse(vikunjaTask);
const listResponse = createTaskListResponse(vikunjaTasks);

// Type-safe error responses
const notFound = createTaskErrorResponse('not_found');
const invalidInput = createTaskErrorResponse('invalid_input');
```

#### MCP Test Helpers (`mcp-test-helpers.ts`)

- `startMcpServer`: Start MCP server for testing with provided token
- `createTestProject`: Create a scoped test project
- `cleanupTestData`: Clean up test data for a specific scope

#### API Test Helpers

- `apiFetch`: Typed fetch wrapper
- `apiPut/apiPost`: Typed request helpers
- `expectApiError`: Error response assertions

#### Vikunja Helpers (`vikunja-test-helpers.ts`)

- `createTestUser`: Integration test user management
- `vikunjaRequest`: Direct API communication helper

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run integration tests only
npm test test/__tests__/integration

# Run specific resource tests
npm test test/__tests__/client/resource/task.test.ts
```

## Best Practices

1. Unit Tests

   - Use MSW for API mocking
   - Keep tests focused and isolated
   - Mock all external dependencies
   - Test both success and error cases
   - Verify type transformations
   - Test default values
   - Validate required fields

2. Integration Tests

   - Test against real Vikunja instance
   - Use fixed test user pattern
   - Add detailed logging
   - Verify actual API behavior
   - Test real error scenarios

3. Test Data Isolation

   - Use scoped test data creation
   - Each test file uses unique scope for its data
   - Always clean up test data after tests
   - Use descriptive scope names

4. Parallel Test Execution

   - Tests can run in parallel safely
   - Test data is isolated by scope
   - No interference between test files
   - Cleanup is scope-specific

5. Response Handling

   - Use type-safe response creators
   - Test transformation edge cases
   - Validate field defaults
   - Check error responses
   - Test optional fields

6. General Guidelines
   - Write tests before implementation
   - Keep test cases focused
   - Use proper type assertions
   - Add meaningful error messages
   - Document complex test setups
   - Maintain test data relationships
   - Use factory functions consistently
