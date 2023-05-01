import { FallbackConversionStrategies } from "../FallbackConversionStrategies";
import { IConversionStrategy } from "../ConversionStrategy";
import { expect } from "vitest";

describe(FallbackConversionStrategies.name, () => {
  describe(FallbackConversionStrategies.prototype.convert.name, () => {
    let strategy: FallbackConversionStrategies<string, string>;
    const successString = "Success!";

    beforeEach(() => {
      strategy = new FallbackConversionStrategies<string, string>(
        new (class implements IConversionStrategy<string, string> {
          convert(from: string): Promise<string> | string {
            throw new Error("ERROR!");
          }
        })(),
        new (class implements IConversionStrategy<string, string> {
          convert(from: string): Promise<string> | string {
            return successString;
          }
        })()
      );
    });

    it("should allow the first strategy to throw", async () => {
      expect(await strategy.convert("123")).toBe(successString);
    });
  });
});
