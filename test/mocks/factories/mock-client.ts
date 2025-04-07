import { VikunjaHttpClient } from '../../../src/client/http/client';

export class MockHttpClient extends VikunjaHttpClient {
  constructor() {
    super({
      config: {
        apiUrl: 'http://mock',
        token: 'mock-token',
      },
    });
  }

  // Override request methods to return mock data
  override get<T>(_path: string): Promise<T> {
    return Promise.resolve({} as T);
  }

  override put<T>(_path: string, _data?: unknown): Promise<T> {
    return Promise.resolve({} as T);
  }

  override post<T>(_path: string, _data?: unknown): Promise<T> {
    return Promise.resolve({} as T);
  }

  override delete(_path: string): Promise<void> {
    return Promise.resolve();
  }
}

export const mockClient = new MockHttpClient();
