import {
  IWebScraperConfig,
  WebScraperConfigs,
} from "./WebScraperConfigs";
import { HttpFetchStrategyConfig } from "../fetchers/AbstractAxiosFetchStrategy";
import { JsonFetchStrategyConfig } from "../fetchers/JsonFetchStrategy";

export class KvdBilConfigs extends WebScraperConfigs {
  constructor() {
    super([new KvdBilConfig()]);
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