import { WebScraperConfig, WebScraperContext } from "./WebScraperContext";
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

export class BlocketConfig extends WebScraperConfig {
  public static apiUrl = `https://api.blocket.se/search_bff/v2/content?st=s&status=active&include=placements&gl=3&include=extend_with_shipping`;

  getUrl(): string {
    return BlocketConfig.apiUrl;
  }
}
