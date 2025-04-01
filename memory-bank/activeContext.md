# Vikunja MCP Server Active Context

## Current Status

### Focus Areas

1. MCP server implementation with FastMCP
2. Resource exposure through MCP protocol
3. Initial MCP server testing infrastructure
4. Integration with existing resource layer

### Recent Decisions

1. Using TypeScript with strict mode for type safety
2. Test-driven development approach with small cycles
3. Using Zod for runtime type validation
4. Custom ValidationError class for error handling
5. Comprehensive validation test strategy
6. Feature-focused architecture with clear separation of concerns
7. Jest with silent reporter for testing
8. Three-layer architecture: MCP server, Resource layer, HTTP client
9. Keep optional features documented in component READMEs
10. Integration tests with real Vikunja instance
11. Use fixed test user for integration tests
12. Direct API response handling in Resource layer
13. Project_id validation in Task resource
14. Direct response handling (no .data wrapper) in Resource layer
15. Use FastMCP for MCP server implementation
16. Keep JSON format for initial MCP responses
17. Local-only MCP server (no remote authentication needed)
18. Resource-first implementation approach for MCP

### Next Steps (Prioritized)

1. Implement MCP Server Testing Infrastructure

   - Set up FastMCP test environment
   - Create resource handling tests
   - Mock project resource using existing factories
   - Test error cases and configuration

2. Implement Basic MCP Server

   - FastMCP server setup
   - Project resource exposure
   - Configuration validation
   - Basic error handling

3. Test End-to-End Flow
   - Resource listing tests
   - Resource reading tests
   - Error handling tests
   - Configuration validation tests

## Architecture

### Layers

1. MCP Server Layer (New)

   - FastMCP integration
   - Resource exposure via MCP protocol
   - Configuration handling
   - Error mapping

2. Resource Layer (Existing)

   - Resource-specific APIs (Project, Task)
   - CRUD operations with validation
   - Resource-specific error handling
   - Direct API response handling

3. HTTP Client Layer (Base)
   - Generic HTTP operations
   - Error handling and normalization
   - Response parsing
   - Auth management

### Technical Design

1. MCP Server Design

   - FastMCP for server implementation
   - JSON format for initial responses
   - Resource-based URI structure (vikunja://projects/{id})
   - Error mapping to MCP protocol

2. Resource Layer Integration
   - Direct resource method calls
   - Response format mapping
   - Error propagation
   - Dependency injection for testing

### Testing Strategy

1. MCP Server Tests

   - Mock project resource using factories
   - Test resource listing and reading
   - Test error handling scenarios
   - Test configuration validation

2. Resource Integration Tests
   - End-to-end flow testing
   - Error propagation verification
   - Response format validation
   - Configuration testing

### Implementation Strategy

1. Test-first development
2. Minimal working implementation
3. Resource-first approach
4. FastMCP integration
5. JSON response format

### Open Questions

1. Future Markdown format conversion strategy?
2. Pagination handling in MCP resources?
3. Resource relationship representation?

## Current Work Items

### Recently Completed

- Task resource implementation
- Integration tests for Task resource
- Project_id validation in Task resource
- Direct response handling in resources
- Unit test updates for unwrapped responses
- Resource layer testing streamlined
- Implemented CI/CD pipeline

### In Progress

- MCP server implementation planning
- FastMCP integration design
- Test infrastructure setup

### Blocked

None currently

### Next Up

1. MCP server test implementation
2. FastMCP server integration
3. Resource exposure
4. End-to-end testing
