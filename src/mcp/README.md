# Vikunja MCP Server

This module implements a [Model Context Protocol](https://modelcontextprotocol.io/) server for Vikunja. It enables accessing Vikunja data through the MCP protocol.

## Configuration

The server is configured through environment variables:

### Required Variables

- **VIKUNJA_API_URL**: Base URL of the Vikunja API (e.g., http://vikunja:3456/api/v1)
- **VIKUNJA_API_TOKEN**: Valid API token for Vikunja authentication

### Configuration Example

```bash
# Required configuration
export VIKUNJA_API_URL="http://vikunja:3456/api/v1"
export VIKUNJA_API_TOKEN="your-api-token"

# Start the server
node dist/mcp/server.js
```

## Supported Features

### Resources

| Resource | List | Read | Complete |
| -------- | ---- | ---- | -------- |
| Project  | ❌   | ✅   | ❌       |

### URI Format

Resources are accessed using the following URI format:

- **Projects**: `vikunja://projects/{id}`

## Development

### Adding New Resources

1. Create a translation layer in `src/mcp/translation/`
2. Create a resource handler in `src/mcp/resources/`
3. Register the resource in `src/mcp/server.ts`
4. Add tests for translation and resource handler

### Running Tests

```bash
# Run all tests
npm test

# Run only MCP tests
npm test -- --testPathPattern=mcp
```

## Future Enhancements

- [ ] Implement project listing
- [ ] Add task resources
- [ ] Support resource completion
- [ ] Implement rate limiting
