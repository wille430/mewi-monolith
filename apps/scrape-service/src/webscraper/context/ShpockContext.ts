import {
  IWebScraperConfig,
  WebScraperContext,
} from "./WebScraperContext";
import { HttpFetchStrategyConfig } from "../fetchers/AbstractAxiosFetchStrategy";
import { JsonFetchStrategyConfig } from "../fetchers/JsonFetchStrategy";
import {StopAtExistingOriginIdStrategy} from "../stoppages/StopAtExistingOriginIdStrategy"

export class ShpockContext extends WebScraperContext {
  constructor() {
    super([new ShpockConfig()], new StopAtExistingOriginIdStrategy());
  }
}

export class ShpockConfig
  implements
    IWebScraperConfig<
      Partial<HttpFetchStrategyConfig> & JsonFetchStrategyConfig
    >
{

  public static limit = 30;

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