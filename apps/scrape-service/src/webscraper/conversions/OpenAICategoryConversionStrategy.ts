import { IConversionStrategy } from "./ConversionStrategy";
import { Configuration, OpenAIApi } from "openai";
import { Category } from "@mewi/models";

export class OpenAICategoryConversionStrategy
  implements IConversionStrategy<string, string>
{
  private static instance: OpenAICategoryConversionStrategy;

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new OpenAICategoryConversionStrategy();
    }

    return this.instance;
  }

  private openai: OpenAIApi;

  private categoryMap: Record<string, Category> = {};

  private constructor() {
    this.openai = new OpenAIApi(this.getOpenAIConfig());
  }

  public async convert(category: string): Promise<string> {
    if (this.categoryMap[category] == null) {
      try {
        const res = await this.openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              content: `Map ${category} to most suitable category one of the following ${Object.values(
                Category
              ).join(",")}`,
              role: "system",
            },
          ],
        });

        this.categoryMap[category] = res.data.choices[0].message
          .content as Category;
      } catch (e) {}
    }

    return this.categoryMap[category];
  }

  private getOpenAIConfig() {
    return new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
}
