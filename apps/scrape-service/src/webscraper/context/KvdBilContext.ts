import {
  IWebScraperConfig,
  WebScraperContext,
} from "./WebScraperContext";
import { HttpFetchStrategyConfig } from "../fetchers/AbstractAxiosFetchStrategy";
import { JsonFetchStrategyConfig } from "../fetchers/JsonFetchStrategy";
import {StopAtExistingOriginIdStrategy} from "../stoppages/StopAtExistingOriginIdStrategy"

export class KvdBilContext extends WebScraperContext {
  constructor() {
    super([new KvdBilConfig()], new StopAtExistingOriginIdStrategy());
  }
}

export class KvdBilConfig
  implements
    IWebScraperConfig<
      Partial<HttpFetchStrategyConfig> & JsonFetchStrategyConfig
    >
{
  getFetchConfig(): Partial<HttpFetchStrategyConfig> & JsonFetchStrategyConfig {
    return {
      dataJsonPath: "auctions",
      url: "https://api.kvd.se/v1/auction/search?orderBy=-grade&auctionType=BUY_NOW",
    };
  }

  getIdentifier(): string {
    return null;
  }

  getUrl(): string {
    return this.getFetchConfig().url;
  }
}