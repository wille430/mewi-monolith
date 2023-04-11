import { IWebScraperConfig, WebScraperConfigs } from "./WebScraperConfigs";
import { JsonFetchStrategyConfig } from "../fetchers/JsonFetchStrategy";
import { HttpFetchStrategyConfig } from "../fetchers/AbstractAxiosFetchStrategy";

export class BlocketConfigs extends WebScraperConfigs<BlocketConfig> {
  constructor() {
    super([new BlocketConfig()]);
  }
}

export class BlocketConfig
  implements IWebScraperConfig<Partial<HttpFetchStrategyConfig>>
{
  public static readonly fetchConfig: Partial<HttpFetchStrategyConfig> &
    JsonFetchStrategyConfig = {
    dataJsonPath: "data",
  };

  getFetchConfig(): Partial<HttpFetchStrategyConfig> {
    return BlocketConfig.fetchConfig;
  }

  getUrl(): string {
    return "https://api.blocket.se/search_bff/v2/content?st=s&status=active&include=placements&gl=3&include=extend_with_shipping";
  }

  getIdentifier(): string {
    return null;
  }
}
