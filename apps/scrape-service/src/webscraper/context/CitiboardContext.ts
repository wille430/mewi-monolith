import { IWebScraperConfig, WebScraperContext } from "./WebScraperContext";
import { HttpFetchStrategyConfig } from "../fetchers/AbstractAxiosFetchStrategy";
import { JsonFetchStrategyConfig } from "../fetchers/JsonFetchStrategy";
import { StopAtOldListingStrategy } from "../stoppages/StopAtOldListingStrategy";
import { ListingOrigin } from "@mewi/models";

export class CitiboardContext extends WebScraperContext {
  constructor() {
    super(
      [new CitiboardConfig()],
      new StopAtOldListingStrategy(ListingOrigin.Citiboard)
    );
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
