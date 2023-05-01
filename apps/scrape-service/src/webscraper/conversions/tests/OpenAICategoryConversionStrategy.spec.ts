import { OpenAICategoryConversionStrategy } from "../OpenAICategoryConversionStrategy";
import { Category } from "@mewi/models";
import { expect } from "vitest";
import { OpenAIApi } from "openai";

describe(OpenAICategoryConversionStrategy.name, () => {
  let strategy: OpenAICategoryConversionStrategy;

  beforeEach(() => {
    strategy = OpenAICategoryConversionStrategy.getInstance();
  });

  /**
   * NOTE: Rate limit is at 3 messages per minute
   */
  describe.each([
    ["Bilar", Category.FORDON],
    ["Kläder", Category.PERSONLIGT],
    ["Leksaker", Category.FRITID_HOBBY],
  ])(
    OpenAICategoryConversionStrategy.prototype.convert.name + " (%s => %s)",
    (input: string, output: string) => {
      let res: string;

      beforeEach(async () => {
        res = await strategy.convert(input);
      });

      it("should equal " + output, () => {
        expect(res).toBe(output);
      });

      it("should cache the response for the same input", async () => {
        const createChatCompletionMock = vi.fn();
        OpenAIApi.prototype.createChatCompletion = createChatCompletionMock;

        res = await strategy.convert(input);
        expect(res).toBe(output);
        expect(createChatCompletionMock).toHaveBeenCalledTimes(0);
      });
    }
  );
});
