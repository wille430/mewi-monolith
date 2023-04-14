import { ListingOrigin } from "@mewi/models";
import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import { WebScraper, WebScraperManager } from "../WebScraper";
import { Listing } from "@mewi/entities";
import { IFetchStrategy } from "../fetchers/FetchStrategy";
import { WebScraperContext } from "../context/WebScraperContext";
import {
  IParseStrategy,
  ListingParseStrategyWrapper,
} from "../parsers/ParseStrategy";
import { IAuthStrategy } from "../auth/AuthStrategy";
import { NoAuthStrategy } from "../auth/NoAuthStrategy";
import { IErrorHandler } from "../error/ErrorHandler";
import { NoErrorHandler } from "../error/NoErrorHandler";
import { createClassLogger } from "../logging/logger";
import { AxiosRequestConfig } from "axios";
import { IFetchDoneStrategy } from "../fetchers/FetchDoneStrategy";

export abstract class AbstractListingScraperFactory<
  TRes = any,
  TReqObj = AxiosRequestConfig
> {
  public abstract getOrigin(): ListingOrigin;

  public abstract createPaginationStrategy(
    webScraper: WebScraper<Listing, TRes>
  ): IPaginationStrategy<TReqObj>;

  public abstract createFetchStrategy(
    webScraper: WebScraper<Listing, TRes>
  ): IFetchStrategy<TRes>;

  public abstract createContext(): WebScraperContext;

  public abstract createParseStrategy(
    webScraper: WebScraper<Listing, TRes>
  ): IParseStrategy<TRes, Listing>;

  public abstract createFetchDoneStrategy(
    fetchStrategy: IFetchStrategy<TRes>
  ): IFetchDoneStrategy<Listing[]>;

  public createAuthStrategy(): IAuthStrategy {
    return new NoAuthStrategy();
  }

  public createErrorHandler(): IErrorHandler<any> {
    return new NoErrorHandler();
  }

  public getFetchStrategyArgs(
    webScraper: WebScraper<any>
  ): [IPaginationStrategy<any>, IAuthStrategy, IErrorHandler<any>] {
    return [
      this.createPaginationStrategy(webScraper),
      this.createAuthStrategy(),
      this.createErrorHandler(),
    ];
  }

  public createListingScraperManager(): WebScraperManager<Listing, TRes> {
    const logger = createClassLogger(this.getOrigin() + "Scraper");
    const webScraper = new WebScraper<Listing, TRes>(logger);
    const contextSwitchedWebScraper = new WebScraperManager(
      webScraper,
      this.createContext()
    );

    const parseStrategy = this.createParseStrategy(webScraper);
    const parseStrategyWrapper = new ListingParseStrategyWrapper<TRes>(
      parseStrategy,
      this.getOrigin()
    );
    const fetchStrategy = this.createFetchStrategy(webScraper);
    fetchStrategy.setFetchDoneStrategy(
      this.createFetchDoneStrategy(fetchStrategy)
    );

    webScraper.setParseStrategy(parseStrategyWrapper);
    webScraper.setFetchStrategy(fetchStrategy);

    return contextSwitchedWebScraper;
  }
}
