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
│   ├── factories.ts  # Test data factories
│   ├── handlers.ts   # MSW request handlers
│   ├── index.ts      # Mock exports
│   ├── server.ts     # MSW server setup
│   └── types.ts      # Mock type definitions
├── utils/            # Test utilities
│   ├── test-helpers.ts
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
- Utility functions for testing API responses

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

4. Test Organization

   - Group tests by resource type
   - Start with basic CRUD verification
   - Add error case testing
   - Include comprehensive logging

5. Response Handling
   - Direct API response handling
   - Type-safe response validation
   - Response structure verification
   - Error response testing

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
```

## Best Practices

1. Unit Tests

   - Use MSW for API mocking
   - Keep tests focused and isolated
   - Mock all external dependencies
   - Test both success and error cases

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
   - Use descriptive scope names (e.g., 'project-test', 'task-test')

4. Parallel Test Execution

   - Tests can run in parallel safely
   - Test data is isolated by scope
   - No interference between test files
   - Cleanup is scope-specific

5. General Guidelines
   - Write tests before implementation
   - Keep test cases focused
   - Use proper type assertions
   - Add meaningful error messages
   - Document complex test setups
