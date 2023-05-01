import { IConversionStrategy } from "./ConversionStrategy";

export class FallbackConversionStrategies<T, R>
  implements IConversionStrategy<T, R>
{
  private readonly strategies: IConversionStrategy<T, R>[];

  constructor(...args: IConversionStrategy<T, R>[]) {
    this.strategies = args;
  }

  public async convert(input: T): Promise<R> {
    if (this.strategies.length === 0) {
      throw new Error("To strategies set");
    }

    for (const strategy of this.strategies) {
      try {
        const res = await strategy.convert(input);
        if (res != null) {
          return res;
        }
      } catch (e) {
        // Do nothing
      }
    }

    throw new Error("No strategy provided a category successfully");
  }
}
