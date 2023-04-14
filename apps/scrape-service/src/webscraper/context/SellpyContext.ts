import { WebScraperConfig, WebScraperContext } from "./WebScraperContext";
import { StopAtOldListingStrategy } from "../stoppages/StopAtOldListingStrategy";
import { ListingOrigin } from "@mewi/models";

export class SellpyContext extends WebScraperContext<SellpyConfig> {
  constructor() {
    super(
      [new SellpyConfig()],
      new StopAtOldListingStrategy(ListingOrigin.Sellpy)
    );
  }
}

export class SellpyConfig extends WebScraperConfig {
  public static limit = 20;
  public static apiUrl = `https://m6wnfr0lvi-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.14.2)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.2.2)%3B%20react%20(16.13.1)%3B%20react-instantsearch%20(6.7.0)&x-algolia-api-key=313e09c3b00b6e2da5dbe382cd1c8f4b&x-algolia-application-id=M6WNFR0LVI`;

  getUrl(): string {
    return SellpyConfig.apiUrl;
  }
}
