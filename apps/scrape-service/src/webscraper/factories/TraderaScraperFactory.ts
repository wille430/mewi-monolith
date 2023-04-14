import { AbstractListingScraperFactory } from "./AbstractListingScraperFactory";
import { WebScraperContext } from "../context/WebScraperContext";
import { TraderaConfig, TraderaContext } from "../context/TraderaContext";
import { IFetchStrategy } from "../fetchers/FetchStrategy";
import {
  IFetchDoneStrategy,
  LimitIsLessStrategy,
} from "../fetchers/FetchDoneStrategy";
import { Listing } from "@mewi/entities";
import { WebScraper } from "../WebScraper";
import { JsonFetchStrategy } from "../fetchers/JsonFetchStrategy";
import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import { AxiosRequestConfig } from "axios";
import { TraderaPaginationStrategy } from "../pagination/TraderaPaginationStrategy";
import { IParseStrategy } from "../parsers/ParseStrategy";
import { TraderaParseStrategy } from "../parsers/TraderaParseStrategy";
import { ListingOrigin } from "@mewi/models";

export class TraderaScraperFactory extends AbstractListingScraperFactory<
  Record<any, any>
> {
  createContext(): WebScraperContext {
    return new TraderaContext();
  }

  createFetchDoneStrategy(
    fetchStrategy: IFetchStrategy<Record<any, any>>
  ): IFetchDoneStrategy<Listing[]> {
    return new LimitIsLessStrategy();
  }

  createFetchStrategy(
    webScraper: WebScraper<Listing, Record<any, any>>
  ): IFetchStrategy<Record<any, any>> {
    return new JsonFetchStrategy(
      ...this.getFetchStrategyArgs(webScraper)
    ).setFetchDoneStrategy(this.createFetchDoneStrategy);
  }

  createPaginationStrategy(
    webScraper: WebScraper<Listing, Record<any, any>>
  ): IPaginationStrategy<AxiosRequestConfig> {
    return new TraderaPaginationStrategy(webScraper);
  }

  createParseStrategy(
    webScraper: WebScraper<Listing, Record<any, any>>
  ): IParseStrategy<Record<any, any>, Listing> {
    return new TraderaParseStrategy(TraderaConfig.baseUrl, webScraper);
  }

  getOrigin(): ListingOrigin {
    return ListingOrigin.Tradera;
  }
}