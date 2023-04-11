import { IWebScraperConfig, WebScraperConfigs } from "./WebScraperConfigs";
import { HttpFetchStrategyConfig } from "../fetchers/AbstractAxiosFetchStrategy";
import { JsonFetchStrategyConfig } from "../fetchers/JsonFetchStrategy";

export class BlippConfigs extends WebScraperConfigs {
  constructor() {
    super([new BlippConfig()]);
  }
}

export class BlippConfig
  implements
    IWebScraperConfig<
      Partial<HttpFetchStrategyConfig> & JsonFetchStrategyConfig
    >
{
  public static limit = 20;

  getFetchConfig(): Partial<HttpFetchStrategyConfig> & JsonFetchStrategyConfig {
    return {
      dataJsonPath: "body.payload.items",
    };
  }

  getIdentifier(): string {
    return null;
  }

  getUrl(): string {
    return "https://blipp.se/api/proxy";
  }
}
