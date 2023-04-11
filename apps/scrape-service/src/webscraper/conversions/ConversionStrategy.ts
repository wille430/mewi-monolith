export interface IConversionStrategy<T = any, R = any> {
  convert(from: T): R | Promise<R>;
}
