import { WebScraperConfig, WebScraperContext } from "./WebScraperContext";
import { StopAtExistingOriginIdStrategy } from "../stoppages/StopAtExistingOriginIdStrategy";

export class BilwebContext extends WebScraperContext {
  constructor() {
    super([new BilwebConfig()], new StopAtExistingOriginIdStrategy());
  }
}

export class BilwebConfig extends WebScraperConfig {
  public static baseUrl = "https://bilweb.se/";

  getUrl(): string {
    return new URL("/sok?query=&type=1", BilwebConfig.baseUrl).toString();
  }
}