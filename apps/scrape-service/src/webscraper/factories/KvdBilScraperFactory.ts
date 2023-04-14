import { AbstractListingScraperFactory } from "./AbstractListingScraperFactory";
import { WebScraperContext } from "../context/WebScraperContext";
import { KvdBilContext } from "../context/KvdBilContext";
import { IFetchStrategy } from "../fetchers/FetchStrategy";
import { LimitIsLessStrategy } from "../fetchers/FetchDoneStrategy";
import { WebScraper } from "../WebScraper";
import { Listing } from "@mewi/entities";
import { JsonFetchStrategy } from "../fetchers/JsonFetchStrategy";
import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import { AxiosRequestConfig } from "axios";
import { UrlQueryParamsPaginationStrategy } from "../pagination/UrlQueryParamsPaginationStrategy";
import { IParseStrategy } from "../parsers/ParseStrategy";
import { KvdBilParseStrategy } from "../parsers/KvdBilParseStrategy";
import { ListingOrigin } from "@mewi/models";

export class KvdBilScraperFactory extends AbstractListingScraperFactory<
  Record<any, any>
> {
  createContext(): WebScraperContext {
    return new KvdBilContext();
  }

  createFetchDoneStrategy() {
    return new LimitIsLessStrategy();
  }

  createFetchStrategy(
    webScraper: WebScraper<Listing, Record<any, any>>
  ): IFetchStrategy<Record<any, any>> {
    return new JsonFetchStrategy(...this.getFetchStrategyArgs(webScraper), {
      dataJsonPath: "auctions",
    });
  }

  createPaginationStrategy(): IPaginationStrategy<AxiosRequestConfig> {
    return new UrlQueryParamsPaginationStrategy({
      pageStartNumber: 0,
      limitParam: "limit",
      offsetParam: "offset",
    });
  }

  createParseStrategy(
    webScraper: WebScraper<Listing, Record<any, any>>
  ): IParseStrategy<Record<any, any>, Listing> {
    return new KvdBilParseStrategy(webScraper);
  }

  getOrigin(): ListingOrigin {
    return ListingOrigin.Kvdbil;
  }
}
