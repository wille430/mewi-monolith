import {WebScraperConfig, WebScraperContext} from "./WebScraperContext"
import { StopAtExistingOriginIdStrategy } from "../stoppages/StopAtExistingOriginIdStrategy";

export class KvdBilContext extends WebScraperContext {
  constructor() {
    super([new KvdBilConfig()], new StopAtExistingOriginIdStrategy());
  }
}

export class KvdBilConfig extends WebScraperConfig {
  public static apiUrl =
    "https://api.kvd.se/v1/auction/search?orderBy=-grade&auctionType=BUY_NOW";

  getUrl(): string {
    return KvdBilConfig.apiUrl;
  }
}