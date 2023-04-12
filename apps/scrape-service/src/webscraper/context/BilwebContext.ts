import {
  IWebScraperConfig,
  WebScraperContext,
} from "./WebScraperContext";
import { HttpFetchStrategyConfig } from "../fetchers/AbstractAxiosFetchStrategy";
import { HtmlFetchStrategyConfig } from "../fetchers/HtmlFetchStrategy";
import {StopAtExistingOriginIdStrategy} from "../stoppages/StopAtExistingOriginIdStrategy"

export class BilwebContext extends WebScraperContext {
  constructor() {
    super([new BilwebConfig()], new StopAtExistingOriginIdStrategy());
  }
}

export class BilwebConfig
  implements
    IWebScraperConfig<
      Partial<HttpFetchStrategyConfig> & HtmlFetchStrategyConfig
    >
{
  public static baseUrl = "https://bilweb.se/";

  getFetchConfig(): Partial<HttpFetchStrategyConfig> & HtmlFetchStrategyConfig {
    return {
      selector: ".Card-Wrapper > .Card",
      url: new URL("/sok?query=&type=1", BilwebConfig.baseUrl).toString(),
    };
  }

  getIdentifier(): string {
    return null;
  }

  getUrl(): string {
    return this.getFetchConfig().url;
  }
}