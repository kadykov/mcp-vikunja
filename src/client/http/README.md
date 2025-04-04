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
- Built-in rate limiting with sensible defaults

### Rate Limiting

The client includes built-in rate limiting to prevent request floods and ensure stable operation:

```typescript
const client = new VikunjaHttpClient({
  config: {
    apiUrl: 'https://vikunja.example.com/api/v1',
    token: 'your-auth-token',
    rateLimit: {
      // Optional, defaults shown below
      maxRequests: 500, // Requests per window
      timeWindow: 60000, // Window size in ms (1 minute)
    },
  },
});
```

- Default limit: 500 requests per minute
- Configurable through `VikunjaConfig`
- Automatic request throttling
- No external dependencies

### Error Handling

The client implements a robust error handling system:

#### Error Hierarchy

```typescript
VikunjaError           // Base error class with immutable error code
├── NetworkError       // Network connectivity issues
├── TimeoutError      // Request timeouts
├── InvalidResponseError // Malformed responses
├── ServerError       // 500-level errors
├── ValidationError   // 400-level validation errors
├── AuthError        // 401/403 authentication errors
└── NotFoundError    // 404/3001/3002 not found errors
```

#### Error Types

- Network errors (connection issues)
- Timeout errors (408)
- Invalid responses (malformed JSON)
- Vikunja-specific errors (3000+ error codes)
  - 3001/3002: Not found errors
  - 3004: Authentication/permission errors
- Standard HTTP errors (400, 401, 403, 404, 500)
- Custom error classes with preserved error codes

Each error includes:

- Original error message
- HTTP or Vikunja-specific error code
- Type-safe error handling

### Extension Points

The client can be extended with additional features:

1. Advanced Features (Optional)
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
   - Built-in rate limiting with configurable limits
   - No built-in pagination handling

2. Scope
   - HTTP communication only
   - No high-level resource handling
   - No caching
