# Vikunja MCP Server Active Context

## Current Status

### Focus Areas

1. Resource layer testing and validation
2. Integration test implementation
3. Error handling and validation integration
4. Documentation and architecture clarification

### Recent Decisions

1. Using TypeScript with strict mode for type safety
2. Test-driven development approach with small cycles
3. Using Zod for runtime type validation
4. Custom ValidationError class for error handling
5. Comprehensive validation test strategy
6. Feature-focused architecture with clear separation of concerns
7. Jest with silent reporter for testing
8. Two-layer architecture: HTTP client and Resource layer
9. Keep optional features documented in component READMEs
10. Integration tests with real Vikunja instance
11. Use fixed test user for integration tests
12. Direct API response handling in Resource layer

### Next Steps (Prioritized)

1. Expand Resource Layer Testing

   - Add integration tests for remaining CRUD operations
   - Implement error case testing
   - Add test cases for resource-specific validation
   - Document testing patterns and best practices

2. Continue Resource Layer Implementation
   - Implement remaining resource types
   - Add comprehensive validation
   - Document resource-specific behaviors

## Architecture

### Layers

1. HTTP Client Layer (Base)

   - Generic HTTP operations
   - Error handling
   - Response parsing
   - Auth management

2. Resource Layer
   - Resource-specific APIs (Project, Task, etc.)
   - CRUD operations
   - Resource validation
   - Type safety
   - Direct API response handling

### Technical Design

1. HTTP client architecture

   - Core request handling
   - Error handling patterns
   - Response parsing
   - Optional features documented in README

2. Resource layer design
   - Base resource class
   - Resource-specific implementations
   - Type-safe methods
   - Validation integration
   - Response transformation

### Testing Strategy

1. Unit Tests

   - Mock service worker for API simulation
   - Test core functionality in isolation
   - Validate error handling

2. Integration Tests
   - Real Vikunja instance
   - Fixed test user
   - Full CRUD operation testing
   - Error case validation

### Implementation Strategy

1. Test-driven development with small cycles
2. Validation-first development using Zod schemas
3. Immediate test coverage for new functionality
4. Clear separation between layers
5. Integration tests against real API

### Reference Implementations

1. **Obsidian Plugin**

   - OpenAPI-generated TypeScript SDK
   - Comprehensive type definitions

2. **n8n Implementation**

   - Lightweight HTTP client
   - Direct API interactions

3. **Official Frontend**
   - Axios with interceptors
   - Model-based approach

### Open Questions

1. How to manage resource relationships in the new layer
2. How to handle resource-specific validation
3. Strategy for cleaning up test data in integration tests

## Current Work Items

### Recently Completed

- Project resource integration tests implemented
- Test helper for Vikunja user management created
- Direct API response handling in Resource layer
- Integration test setup with real Vikunja instance

### In Progress

- Expanding integration test coverage
- Resource layer implementation for other types

### Blocked

None currently

### Completed

- Initial project scope definition
- Core requirements documentation
- System architecture planning
- Configuration system implementation
- Configuration validation with tests
- Test infrastructure setup
- OpenAPI type generation implemented
- Runtime validation system implemented
  - Custom ValidationError class
  - Zod schemas for API types
  - Comprehensive test coverage
- API client implementation strategy defined
- HTTP client implementation and documentation
- Basic Project resource implementation and unit tests
- Integration test infrastructure setup
