import {WebScraperConfig, WebScraperContext} from "./WebScraperContext"
import { StopAtExistingOriginIdStrategy } from "../stoppages/StopAtExistingOriginIdStrategy";

export class ShpockContext extends WebScraperContext {
  constructor() {
    super([new ShpockConfig()], new StopAtExistingOriginIdStrategy());
  }
}

export class ShpockConfig extends WebScraperConfig {
  public static limit = 30;
  public static apiUrl = "https://www.shpock.com/graphql";

  getUrl(): string {
    return ShpockConfig.apiUrl;
  }

  getMethod(): string {
    return "POST"
  }
}