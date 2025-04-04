import type { VikunjaConfig } from '../../config/types.js';
import type { HTTPError } from '../../types';
import { RateLimiter } from './rate-limiter.js';
import {
  AuthError,
  InvalidResponseError,
  NetworkError,
  NotFoundError,
  ServerError,
  TimeoutError,
  ValidationError,
  VikunjaError,
} from './errors.js';

interface VikunjaClientConfig {
  config: VikunjaConfig;
}

export class VikunjaHttpClient {
  private readonly baseUrl: string;
  private token: string;

  private rateLimiter: RateLimiter;

  constructor({ config }: VikunjaClientConfig) {
    // Remove trailing slash if present and ensure /api/v1 is included
    const cleanUrl = config.apiUrl.replace(/\/$/, '');
    this.baseUrl = cleanUrl.endsWith('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`;
    this.token = config.token;

    // Initialize rate limiter with default values if not provided
    const maxRequests = config.rateLimit?.maxRequests ?? 500;
    const timeWindow = config.rateLimit?.timeWindow ?? 60000; // 1 minute in ms
    this.rateLimiter = new RateLimiter(maxRequests, timeWindow);
  }

  get config(): VikunjaConfig {
    return {
      apiUrl: this.baseUrl,
      token: this.token,
    };
  }

  set config(config: VikunjaConfig) {
    this.token = config.token;
  }

  /**
   * Make a GET request
   */
  async get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  /**
   * Make a PUT request
   */
  async put<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>('PUT', path, data);
  }

  /**
   * Make a POST request
   */
  async post<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>('POST', path, data);
  }

  /**
   * Make a DELETE request
   */
  async delete(path: string): Promise<void> {
    await this.request('DELETE', path);
  }

  /**
   * Make an HTTP request
   */
  private async request<T>(method: string, path: string, data?: unknown): Promise<T> {
    // Check rate limit before making request
    await this.rateLimiter.waitIfNeeded();

    // Ensure proper URL construction without double /api
    let requestPath = path;
    if (!requestPath.startsWith('/')) {
      requestPath = '/' + requestPath;
    }
    const url = this.baseUrl + requestPath;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Handle no-content responses (e.g. for DELETE)
      if (response.status === 204) {
        return undefined as T;
      }

      try {
        const json = await response.json();
        return json as T;
      } catch {
        // Handle JSON parse errors
        throw new InvalidResponseError('Invalid JSON response');
      }
    } catch (error) {
      // Re-throw VikunjaErrors
      if (error instanceof VikunjaError) {
        throw error;
      }

      // Handle invalid JSON responses
      if (error instanceof SyntaxError) {
        throw new InvalidResponseError('Invalid JSON response');
      }

      // Handle network errors (Response.error())
      if (error instanceof TypeError) {
        throw new NetworkError();
      }

      // Other unknown errors
      throw new ServerError({
        code: 500,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Handle error responses from the API
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let error: HTTPError;
    let rawError: string | undefined;

    try {
      rawError = await response.text();
      if (!rawError) {
        throw new Error('Empty response');
      }

      let errorData = JSON.parse(rawError) as HTTPError;

      // First, try to parse as a Vikunja error directly
      if (typeof errorData.code === 'number' && errorData.code > 0) {
        // Convert HTTP status codes to Vikunja code if needed
        const vikunjaError = {
          code: errorData.code,
          message: errorData.message || response.statusText || 'Unknown error',
        };

        if (errorData.code >= 3000) {
          // Use specific Vikunja error codes
          switch (errorData.code) {
            case 3001:
            case 3002:
              return Promise.reject(new NotFoundError(vikunjaError));
            case 3004:
              return Promise.reject(new AuthError(vikunjaError));
            default:
              return Promise.reject(new ValidationError(vikunjaError));
          }
        }
      }

      // Fallback to using HTTP status with original message
      error = {
        code: response.status,
        message: errorData.message || response.statusText || 'Unknown error',
      };
    } catch {
      // If we can't parse JSON or it's not a Vikunja error response
      error = {
        code: response.status,
        message: rawError || response.statusText || 'Unknown error',
      };
    }

    // Fallback to HTTP status based error handling
    switch (response.status) {
      case 400:
        throw new ValidationError(error);
      case 401:
      case 403:
        throw new AuthError(error);
      case 404:
        throw new NotFoundError(error);
      case 408:
        throw new TimeoutError();
      case 500:
        throw new ServerError(error);
      default:
        throw new ServerError(error);
    }
  }
}
