# Vikunja MCP Server System Patterns

## Architecture Overview

```mermaid
graph TD
    subgraph MCP Server
        Resources[Resource Handlers]
        Tools[Tool Handlers]
        Config[Configuration]
        Client[Vikunja API Client]
    end

    subgraph External
        API[Vikunja API]
        Settings[MCP Settings]
    end

    Resources --> Client
    Tools --> Client
    Client --> API
    Config --> Settings
```

## Core Patterns

### 1. Resource Pattern

- Expose Vikunja entities as MCP resources
- URIs follow pattern: `vikunja://{entity}/{id}`
- Resources are read-only snapshots
- Include essential metadata

### 2. Tool Pattern

- CRUD operations implemented as tools
- Consistent input/output schemas
- Error handling and validation
- Idempotent operations where possible

### 3. Configuration Pattern

- Environment-based configuration
- Validation at startup
- Secure credential handling
- Defaults with overrides

### 4. API Client Pattern

- Centralized API communication
- OpenAPI-generated type definitions
- Type-safe request/response handling
- Error normalization
- Rate limiting consideration

### 5. Test-Driven Pattern

- Write tests before implementation
- Small, focused test cycles
- Immediate debugging and validation
- Continuous test coverage maintenance

## Design Decisions

1. **Type Safety**

   - Use TypeScript strict mode
   - Generate types from OpenAPI spec
   - Runtime type validation with Zod
   - Auto-updated type definitions

2. **Testing Strategy**

   - MSW for API mocking
   - Test-first development cycle
   - Integration tests with mocked responses
   - Mock MCP context for testing

3. **Error Handling**

   - Standardized error responses
   - Clear error messages
   - Error categorization

4. **Code Organization**
   - Feature-based structure
   - Clear separation of concerns
   - Dependency injection ready
