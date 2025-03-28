# Vikunja MCP Server Active Context

## Current Status

### Focus Areas

1. HTTP client setup with MSW for testing
2. Core CRUD operations implementation
3. Error handling and validation integration
4. Integration testing with MSW

### Recent Decisions

1. Using TypeScript with strict mode for type safety
2. Test-driven development approach with small cycles
3. Using Zod for runtime type validation
4. Custom ValidationError class for error handling
5. Comprehensive validation test strategy
6. Feature-focused architecture with clear separation of concerns
7. Jest with silent reporter for testing

### Next Steps (Prioritized)

1. Set up MSW for API mocking
2. Create HTTP client tests with MSW
3. Implement base HTTP client and debug tests
4. Create CRUD operation tests
5. Implement core CRUD operations and debug tests
6. Create error handling tests
7. Implement error handling and debug tests
8. Set up CI validation

## Active Considerations

### Technical Design

1. HTTP client architecture with axios
2. Resource URI patterns and entity modeling
3. Error handling and validation integration
4. Request/Response validation strategies

### Implementation Strategy

1. Test-driven development with small cycles
2. Validation-first development using Zod schemas
3. Immediate test coverage for new functionality
4. Clear separation between HTTP client and validation logic

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

1. Rate limiting implementation details
2. Request retry policies
3. Integration of validation with HTTP client
4. Error recovery strategies

## Current Work Items

### In Progress

- Planning MSW setup for API mocking
- Designing HTTP client structure with validation
- Defining integration test strategy

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
