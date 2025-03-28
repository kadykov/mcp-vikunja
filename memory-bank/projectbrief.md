# Vikunja MCP Server Project Brief

## Overview

Build a Model Context Protocol (MCP) server for the Vikunja open source project management tool. The server will provide AI assistants with structured access to Vikunja's functionality through the MCP protocol.

## Core Requirements

### Functional Requirements

1. Connect to Vikunja REST API (OpenAPI-based)
2. Expose basic Vikunja entities via MCP resources
3. Provide CRUD operations via MCP tools
4. Focus on projects and tasks management
5. Configuration via MCP JSON config file (API URL, auth token)

### Technical Requirements

1. TypeScript implementation using MCP TypeScript SDK
2. Test-driven development approach
3. Strict TypeScript configuration
4. Linting and code formatting (Prettier)
5. Comprehensive documentation
6. Publishable as npm package

## Project Scope

### In Scope

- Basic CRUD operations for projects and tasks
- MCP resources for core Vikunja entities
- MCP tools for common project management actions
- Configuration system for Vikunja connection details
- Unit and integration tests
- TypeScript type definitions
- Documentation (usage, setup, development)

### Out of Scope

- Advanced Vikunja features beyond basic project/task management
- Custom UI components
- Backend storage or caching
- Authentication flow implementation (using config-provided tokens only)

## Success Metrics

1. All core CRUD operations working reliably
2. 90%+ test coverage
3. Zero TypeScript strict mode errors
4. Clear, maintainable codebase
5. Comprehensive documentation
6. Successfully published to npm
