import { IWebScraperConfig, WebScraperContext } from "./WebScraperContext";
import { HttpFetchStrategyConfig } from "../fetchers/AbstractAxiosFetchStrategy";
import { JsonFetchStrategyConfig } from "../fetchers/JsonFetchStrategy";
import { StopAtOldListingStrategy } from "../stoppages/StopAtOldListingStrategy";
import { ListingOrigin } from "@mewi/models";

export class BlippContext extends WebScraperContext {
  constructor() {
    super(
      [new BlippConfig()],
      new StopAtOldListingStrategy(ListingOrigin.Blipp)
    );
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
