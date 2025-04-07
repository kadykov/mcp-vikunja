# Vikunja MCP Server

This module implements a [Model Context Protocol](https://modelcontextprotocol.io/) server for Vikunja. It enables accessing Vikunja data through the MCP protocol.

## Configuration

The server is configured through environment variables:

### Required Variables

- **VIKUNJA_API_URL**: Base URL of the Vikunja server (e.g., https://app.vikunja.cloud/). The server will automatically append '/api/v1' to the URL if not present.
- **VIKUNJA_API_TOKEN**: Valid API token for Vikunja authentication

### Optional Variables

- **VIKUNJA_API_RATE_LIMIT**: Maximum API requests per window (default: 500)
- **VIKUNJA_API_RATE_LIMIT_WINDOW**: Time window in milliseconds (default: 60000)

### Configuration Example

```bash
# Required configuration
export VIKUNJA_API_URL="https://app.vikunja.cloud/"
export VIKUNJA_API_TOKEN="your-api-token"

# Optional rate limiting configuration
export VIKUNJA_API_RATE_LIMIT="500"      # 500 requests per window
export VIKUNJA_API_RATE_LIMIT_WINDOW="60000"  # 1 minute window

# Start the server
node dist/mcp/server.js
```

### Rate Limiting

The server includes built-in rate limiting for Vikunja API requests:

- Default: 500 requests per minute
- Configurable through environment variables
- Automatic request throttling to stay within limits
- Applies to all API operations

## Supported Features

### Resources

| Resource | List | Read | Complete |
| -------- | ---- | ---- | -------- |
| Projects | ❌   | ✅   | ✅       |
| Tasks    | ❌   | ✅   | ✅       |

### URI Format

Resources are accessed using a unified URI template:

```
vikunja://{resource}/{id}
```

Where:

- **resource**: either `projects` or `tasks`
- **id**: numeric identifier of the resource

Example URIs:

- `vikunja://projects/123`
- `vikunja://tasks/456`

## Development

### Architecture

1. **URI Handling**

   - Single URI template for all resources
   - Type-safe resource type validation
   - Built-in template parsing via MCP SDK

2. **Resource Handlers**

   - Unified handler for all resources
   - Resource type discrimination in variables
   - Direct renderer usage for content generation

3. **Renderers**
   - Markdown generation for each resource type
   - Async support for related data fetching
   - Type-safe URI creation

### Adding New Resources

1. Add new resource type to `src/mcp/uri.ts`:

   ```typescript
   export type ResourceType = 'projects' | 'tasks' | 'your-resource';
   ```

2. Update unified resource handler in `src/mcp/resources/index.ts`:

   ```typescript
   if (resource === 'your-resource') {
     const data = await yourResource.get(Number(id));
     return { contents: [{ uri: uri.href, text: await yourRenderer.render(data) }] };
   }
   ```

3. Add a Markdown renderer for the resource type
4. Add tests for renderer and update E2E tests

### Running Tests

```bash
# Run all tests
npm test

# Run only MCP tests
npm test -- --testPathPattern=mcp

# Run E2E tests
npm test -- --testPathPattern=e2e
```

## Future Enhancements

- [ ] Implement resource listing
- [x] Add task resources
- [x] Support resource URI completion
- [x] Implement rate limiting
- [ ] Support filtering resources
- [ ] Add label resources
