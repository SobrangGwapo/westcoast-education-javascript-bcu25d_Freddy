export interface IHttpClient<T> {
  add(data: T): Promise<T>;
  find(id: number): Promise<T>;
  listAll(): Promise<T>;
}