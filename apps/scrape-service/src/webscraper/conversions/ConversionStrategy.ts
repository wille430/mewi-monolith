export interface IConversionStrategy<T = any, R = T> {
  convert(from: T): R | Promise<R>;
}
