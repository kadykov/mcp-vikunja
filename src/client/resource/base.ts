import { VikunjaHttpClient } from '../http/client';

export interface IResource<T> {
  get(id: number): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

export abstract class BaseResource<T> implements IResource<T> {
  constructor(protected client: VikunjaHttpClient) {}

  abstract get(id: number): Promise<T>;
  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: number, data: Partial<T>): Promise<T>;
  abstract delete(id: number): Promise<void>;
}
