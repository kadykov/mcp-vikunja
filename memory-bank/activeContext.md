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
13. Project_id validation in Task resource
14. Direct response handling (no .data wrapper) in Resource layer
15. Removed example and HTTP layer tests in favor of resource layer tests

### Next Steps (Prioritized)

1. Expand Error Case Testing

   - Add thorough validation error testing
   - Test edge cases in CRUD operations
   - Verify error message propagation
   - Document error handling patterns

2. Add Pagination and Query Support

   - Implement pagination in list operations
   - Add query parameter handling
   - Test parameter validation
   - Document usage patterns

3. Begin Additional Resource Types
   - Labels implementation
   - Comments implementation
   - Teams implementation
   - Users implementation

## Architecture

### Layers

1. HTTP Client Layer (Base)

   - Generic HTTP operations
   - Error handling and normalization
   - Response parsing
   - Auth management

2. Resource Layer
   - Resource-specific APIs (Project, Task)
   - CRUD operations with validation
   - Resource-specific error handling
   - Direct API response handling

### Technical Design

1. Resource Layer Response Handling

   - Direct response mapping (no .data wrapper)
   - Type-safe response processing
   - Resource-specific validation (e.g., project_id)
   - Error normalization and propagation

2. Integration Testing Design
   - Real API response validation
   - Project creation for task tests
   - Test data cleanup consideration
   - Error case coverage

### Testing Strategy

1. Unit Tests

   - MSW request simulation
   - Core functionality testing
   - Error case validation
   - Response format verification
   - Focus on resource layer testing
   - Removed redundant HTTP layer tests
   - Removed example tests

2. Integration Tests
   - Real Vikunja instance
   - Fixed test user pattern
   - CRUD operation coverage
   - Error case verification

### Implementation Strategy

1. Test-first development
2. Validation at resource layer
3. Direct response handling
4. Comprehensive test coverage
5. Clear error patterns

### Open Questions

1. How to handle pagination in list responses?
2. Best approach for cleanup in integration tests?
3. Strategy for handling bulk operations?

## Current Work Items

### Recently Completed

- Task resource implementation
- Integration tests for Task resource
- Project_id validation in Task resource
- Direct response handling in resources
- Unit test updates for unwrapped responses
- Removed example and HTTP layer tests to streamline testing approach

### In Progress

- Expanding error case testing
- Planning pagination support
- Documenting test patterns

### Blocked

None currently

### Next Up

1. Error case testing expansion
2. Pagination implementation
3. Query parameter support
4. Labels resource implementation
