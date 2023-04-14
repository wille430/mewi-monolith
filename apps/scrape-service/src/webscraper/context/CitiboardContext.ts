import { WebScraperConfig, WebScraperContext } from "./WebScraperContext";
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

export class CitiboardConfig extends WebScraperConfig {
  public static apiUrl =
    "https://api42.citiboard.se/cb/annonslista?url=/&sort=&sok=";

  getUrl(): string {
    return CitiboardConfig.apiUrl;
  }
}
