import {
  IWebScraperConfig,
  WebScraperConfigs,
} from "./WebScraperConfigs";
import { HttpFetchStrategyConfig } from "../fetchers/AbstractAxiosFetchStrategy";
import { JsonFetchStrategyConfig } from "../fetchers/JsonFetchStrategy";

export class CitiboardConfigs extends WebScraperConfigs {
  constructor() {
    super([new CitiboardConfig()]);
  }
}

class CitiboardConfig
  implements
    IWebScraperConfig<
      Partial<HttpFetchStrategyConfig> & JsonFetchStrategyConfig
    >
{
  getFetchConfig(): Partial<HttpFetchStrategyConfig> & JsonFetchStrategyConfig {
    return {
      dataJsonPath: "annonser",
      url: "https://api42.citiboard.se/cb/annonslista?url=/&sort=&sok=",
    };
  }

  getIdentifier(): string {
    return null;
  }

  getUrl(): string {
    return this.getFetchConfig().url;
  }
}
