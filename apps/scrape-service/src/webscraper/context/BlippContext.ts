import {WebScraperConfig, WebScraperContext} from "./WebScraperContext"
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

export class BlippConfig extends WebScraperConfig {
  public static limit = 20;

  getUrl(): string {
    return "https://blipp.se/api/proxy";
  }
}
