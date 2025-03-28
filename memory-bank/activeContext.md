# Vikunja MCP Server Active Context

## Current Status

### Focus Areas

1. API client implementation with OpenAPI type generation
2. HTTP client setup and testing
3. Core CRUD operations implementation
4. Error handling and validation
5. Integration testing with MSW

### Recent Decisions

1. Using TypeScript with strict mode for type safety
2. Test-driven development approach with small cycles
3. Generate types from OpenAPI specification
4. Feature-focused architecture with clear separation of concerns
5. Configuration system with Zod validation
6. Jest with silent reporter for testing

### Next Steps (Prioritized)

1. Create OpenAPI type generation script
2. Set up MSW for API mocking
3. Create HTTP client tests with MSW
4. Implement base HTTP client and debug tests
5. Create CRUD operation tests
6. Implement core CRUD operations and debug tests
7. Create error handling tests
8. Implement error handling and debug tests
9. Set up CI validation

## Active Considerations

### Technical Design

1. Type generation from OpenAPI schema
2. HTTP client architecture with axios
3. Resource URI patterns and entity modeling
4. Error handling and validation strategies

### Implementation Strategy

1. Test-driven development with small cycles
2. Type-first development using OpenAPI schema
3. Immediate test coverage for new functionality
4. Clear separation between HTTP client and business logic

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

1. Scope of OpenAPI type generation script testing
2. Rate limiting implementation details
3. Error recovery strategies
4. Request retry policies

## Current Work Items

### In Progress

- Planning OpenAPI type generation implementation
- Designing HTTP client structure
- Defining test strategy

### Blocked

None currently

### Completed

- Initial project scope definition
- Core requirements documentation
- System architecture planning
- Configuration system implementation
- Configuration validation with tests
- Test infrastructure setup
- API client implementation strategy defined
