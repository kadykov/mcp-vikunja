import type { VikunjaConfig } from '../../config/types';
import type { HTTPError } from '../../types';
import {
  AuthError,
  InvalidResponseError,
  NetworkError,
  NotFoundError,
  ServerError,
  TimeoutError,
  ValidationError,
  VikunjaError,
} from './errors';

interface VikunjaClientConfig {
  config: VikunjaConfig;
}

export class VikunjaHttpClient {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor({ config }: VikunjaClientConfig) {
    this.baseUrl = config.apiUrl.replace(/\/$/, ''); // Remove trailing slash if present
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
    const url = new URL(path.startsWith('/') ? path.substring(1) : path, this.baseUrl);

    try {
      const response = await fetch(url.toString(), {
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
        throw new InvalidResponseError('Invalid JSON response');
      }
    } catch (error) {
      if (error instanceof VikunjaError) {
        throw error;
      }

      // Network errors from fetch
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
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

    try {
      const json = await response.json();
      error = json as HTTPError;
    } catch {
      error = {
        code: response.status,
        message: response.statusText || 'Unknown error',
      };
    }

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
