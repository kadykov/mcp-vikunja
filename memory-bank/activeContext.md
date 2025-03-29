# Vikunja MCP Server Active Context

## Current Status

### Focus Areas

1. Resource layer design and implementation
2. Error handling and validation integration
3. Documentation and architecture clarification

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

### Next Steps (Prioritized)

1. Design and implement Resource Layer

   - Create base resource class
   - Design resource-specific implementations
   - Plan test migration strategy
   - Implement initial resources

2. Migrate CRUD tests to resource layer
   - Keep existing tests until migration complete
   - Move test logic to resource-specific tests
   - Clean up after successful migration

## Architecture

### Layers

1. HTTP Client Layer (Base)

   - Generic HTTP operations
   - Error handling
   - Response parsing
   - Auth management

2. Resource Layer (New)
   - Resource-specific APIs (Project, Task, etc.)
   - CRUD operations
   - Resource validation
   - Type safety

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

### Implementation Strategy

1. Test-driven development with small cycles
2. Validation-first development using Zod schemas
3. Immediate test coverage for new functionality
4. Clear separation between layers

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

## Current Work Items

### Recently Completed

- Basic HTTP client implemented and tested
- MSW testing infrastructure set up
- Project and Task endpoint tests implemented
- Core error handling established
- HTTP client documentation and README

### In Progress

- Resource layer design
- Test migration strategy

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
