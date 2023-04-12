import { IWebScraperConfig, WebScraperContext } from "./WebScraperContext";
import { JsonFetchStrategyConfig } from "../fetchers/JsonFetchStrategy";
import { HttpFetchStrategyConfig } from "../fetchers/AbstractAxiosFetchStrategy";
import { StopAtOldListingStrategy } from "../stoppages/StopAtOldListingStrategy";
import { ListingOrigin } from "@mewi/models";

export class BlocketContext extends WebScraperContext<BlocketConfig> {
  constructor() {
    super(
      [new BlocketConfig()],
      new StopAtOldListingStrategy(ListingOrigin.Blocket)
    );
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
