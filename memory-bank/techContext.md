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

- Jest
- ts-jest
- OpenAPI Types
- Mock Service Worker (optional)

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
├── resources/      # MCP resource implementations
├── tools/          # MCP tool implementations
├── client/         # Vikunja API client
├── utils/          # Shared utilities
└── index.ts        # Main entry point

test/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── fixtures/       # Test data

docs/               # Documentation
```

## Technical Constraints

1. **API Limitations**

   - Must respect Vikunja API rate limits
   - Handle API version compatibility
   - Consider API response time in tools

2. **Type Safety**

   - Full TypeScript coverage
   - No any types except in tests
   - Strict null checks

3. **Testing Requirements**
   - 90%+ code coverage
   - Integration test suite
   - Mocked external dependencies

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
- @types/node
- @types/jest
- eslint
- prettier
- npm-run-all
