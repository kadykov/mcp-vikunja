import { server } from '../../../mocks/server';
import { http } from 'msw';
import { API_BASE } from '../../../utils/test-helpers';
import { VikunjaHttpClient } from '../../../../src/client/http/client';
import { createVikunjaErrorResponse } from '../../../mocks/errors';
import { AuthError, NotFoundError, ServerError } from '../../../../src/client/http/errors';

const client = new VikunjaHttpClient({
  config: {
    apiUrl: API_BASE,
    token: 'test-token',
  },
});

describe('Vikunja Error Handling', () => {
  test('should handle project not found error (3001)', async () => {
    server.use(
      http.get(`${API_BASE}/test`, () => {
        return createVikunjaErrorResponse(3001, 'The project does not exist', 404);
      })
    );

    await expect(client.get('/test')).rejects.toThrow(NotFoundError);
    await expect(client.get('/test')).rejects.toThrow('The project does not exist');
  });

  test('should handle permission error (3004)', async () => {
    server.use(
      http.get(`${API_BASE}/test`, () => {
        return createVikunjaErrorResponse(
          3004,
          'The user needs to have read permissions on that project to perform that action',
          403
        );
      })
    );

    await expect(client.get('/test')).rejects.toThrow(AuthError);
  });

  test('should include Vikunja error code in error object', async () => {
    server.use(
      http.get(`${API_BASE}/test`, () => {
        return createVikunjaErrorResponse(3001, 'The project does not exist', 404);
      })
    );

    try {
      await client.get('/test');
      throw new Error('Expected an error to be thrown');
    } catch (err: unknown) {
      if (err instanceof NotFoundError) {
        expect(err.code).toBe(3001);
        expect(err.message).toBe('The project does not exist');
      } else {
        throw err;
      }
    }
  });

  test('should handle malformed Vikunja error responses', async () => {
    server.use(
      http.get(`${API_BASE}/test`, () => {
        return new Response('Invalid JSON but HTTP 500', { status: 500 });
      })
    );

    await expect(client.get('/test')).rejects.toThrow(ServerError);
  });

  test('should handle non-Vikunja error responses', async () => {
    server.use(
      http.get(`${API_BASE}/test`, () => {
        return new Response(JSON.stringify({ error: 'Some other API format' }), { status: 404 });
      })
    );

    await expect(client.get('/test')).rejects.toThrow(NotFoundError);
  });
});
