# HTTP Client Layer

This package provides a low-level HTTP client for interacting with the Vikunja API. It handles basic HTTP operations, authentication, error handling, and response parsing.

## Usage

```typescript
const client = new VikunjaHttpClient({
  config: {
    apiUrl: 'https://vikunja.example.com/api/v1',
    token: 'your-auth-token',
  },
});

// Make requests
const result = await client.get('/path');
await client.post('/path', { data: 'value' });
await client.put('/path', { data: 'value' });
await client.delete('/path');
```

## Features

### Core Functionality

- Basic HTTP methods (GET, POST, PUT, DELETE)
- Authentication via Bearer token
- JSON request/response handling
- Error normalization

### Error Handling

- Network errors
- Timeout errors
- Invalid responses
- API errors (400, 401, 403, 404, 500)
- Error type mapping to custom error classes

### Extension Points

The client can be extended with additional features:

1. Advanced Features (Optional)
   - Rate limiting for API compliance
   - Request retry for transient failures
   - File upload handling
   - Pagination handling helpers

## Design Decisions

1. Minimal Dependencies

   - Uses native fetch API
   - No external HTTP client dependencies
   - Simple error handling

2. Type Safety

   - Full TypeScript support
   - Generic request/response types
   - Custom error types

3. Error Handling
   - Custom error classes for different scenarios
   - Error normalization across API
   - Typed error responses

## Testing

The client is tested using MSW (Mock Service Worker) for API mocking:

- Core functionality tests in `client.test.ts`
- Error handling scenarios
- Request/response validation

## Limitations

1. Current Implementation

   - Basic HTTP operations only
   - No advanced features (retry, rate limiting)
   - No built-in pagination handling

2. Scope
   - HTTP communication only
   - No high-level resource handling
   - No caching
