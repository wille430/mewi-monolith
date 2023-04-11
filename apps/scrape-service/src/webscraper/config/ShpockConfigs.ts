import {
  IWebScraperConfig,
  WebScraperConfigs,
} from "./WebScraperConfigs";
import { HttpFetchStrategyConfig } from "../fetchers/AbstractAxiosFetchStrategy";
import { JsonFetchStrategyConfig } from "../fetchers/JsonFetchStrategy";

export class ShpockConfigs extends WebScraperConfigs {
  constructor() {
    super([new ShpockConfig()]);
  }
}

export class ShpockConfig
  implements
    IWebScraperConfig<
      Partial<HttpFetchStrategyConfig> & JsonFetchStrategyConfig
    >
{
  getFetchConfig(): Partial<HttpFetchStrategyConfig> & JsonFetchStrategyConfig {
    return {
      dataJsonPath: "data.itemSearch.itemResults[0].items",
      method: "POST",
      url: "https://www.shpock.com/graphql",
    };
  }

  getIdentifier(): string {
    return null;
  }

  getUrl(): string {
    return this.getFetchConfig().url;
  }
}