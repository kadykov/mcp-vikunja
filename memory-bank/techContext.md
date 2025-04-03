# Vikunja MCP Server Technical Context

## Technology Stack

### Core Technologies

- TypeScript (Strict Mode)
- MCP TypeScript SDK
- Node.js
- Vikunja REST API

### Development Tools

- Jest (Testing)
- ESLint (Linting)
- Prettier (Formatting)
- TypeScript Compiler
- npm (Package Management)

### Testing Stack

- Jest (Test runner)
- ts-jest (TypeScript support)
- Mock Service Worker (API mocking)
- OpenAPI Types
- Zod (Runtime validation)

## Development Setup

### Required Tools

```bash
node >= 18
npm >= 8
typescript >= 4.8
```

### Project Structure

```
src/
├── config/          # Configuration handling
├── types/          # TypeScript types
│   └── openapi/    # Generated OpenAPI types
├── client/         # Vikunja API client
│   ├── types/      # Client type definitions
│   ├── http/       # HTTP client implementation
│   └── handlers/   # API endpoint handlers
├── resources/      # MCP resource implementations
├── tools/          # MCP tool implementations
├── utils/          # Shared utilities
└── index.ts        # Main entry point

scripts/
└── generate-types/ # OpenAPI type generation

test/
├── mocks/          # MSW handlers and fixtures
├── client/         # API client tests
├── resources/      # Resource handler tests
├── tools/          # Tool handler tests
└── fixtures/       # Test data and helpers

docs/               # Documentation
```

## Technical Constraints

1. **API Limitations**

   - Client-side rate limiting with conservative defaults (500 requests/minute)
   - Built-in protection against request floods
   - Rate limit configuration through VikunjaConfig
   - Handle API version compatibility
   - Consider API response time in tools

2. **Type Safety**

   - Full TypeScript coverage
   - No any types except in tests
   - Strict null checks

3. **Testing Requirements**
   - Code coverage tracking as informative metric
   - Integration test suite
   - Mocked external dependencies
   - Coverage reports without enforcement thresholds

## Testing Infrastructure

### MSW Testing Setup

1. **Type-Safe Handlers**

   - Integration with OpenAPI types
   - Consistent response formats
   - Error handling patterns
   - Factory-based test data ```

2. **Factory System**

   - Type-safe data generation
   - Default values with overrides
   - Relationship support
   - Valid test data guarantees

3. **Error Handling**
   - Custom ApiError class
   - Consistent error responses
   - Status code normalization
   - Error assertion utilities

## Dependencies

### Production Dependencies

- @modelcontextprotocol/sdk
- axios (or similar HTTP client)
- zod (runtime type validation)
- dotenv (configuration)

### Development Dependencies

- typescript
- jest
- ts-jest
- msw
- @types/node
- @types/jest
- eslint
- prettier
- npm-run-all
