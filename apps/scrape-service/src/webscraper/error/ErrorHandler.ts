export interface IErrorHandler<T> {
  isError(obj: T): Promise<boolean> | boolean;
}
