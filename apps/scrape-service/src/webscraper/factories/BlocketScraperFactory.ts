// noinspection LongLine

import { WebScraperContext } from "../context/WebScraperContext";
import { BlocketContext } from "../context/BlocketContext";
import { IFetchStrategy } from "../fetchers/FetchStrategy";
import { AbstractAxiosFetchStrategy } from "../fetchers/AbstractAxiosFetchStrategy";
import { HasNextPageStrategy } from "../fetchers/FetchDoneStrategy";
import { WebScraper } from "../WebScraper";
import { Listing } from "@mewi/entities";
import { JsonFetchStrategy } from "../fetchers/JsonFetchStrategy";
import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import { UrlQueryParamsPaginationStrategy } from "../pagination/UrlQueryParamsPaginationStrategy";
import { IParseStrategy } from "../parsers/ParseStrategy";
import { BlocketParseStrategy } from "../parsers/BlocketParseStrategy";
import { IAuthStrategy } from "../auth/AuthStrategy";
import { NextBearerAuthStrategy } from "../auth/NextBearerAuthStrategy";
import { ListingOrigin } from "@mewi/models";
import { AbstractListingScraperFactory } from "./AbstractListingScraperFactory";
import { AxiosRequestConfig } from "axios";

export class BlocketScraperFactory extends AbstractListingScraperFactory<
  Record<any, any>
> {
  createContext(): WebScraperContext {
    return new BlocketContext();
  }

  createFetchDoneStrategy(fetchStrategy: IFetchStrategy<Record<any, any>>) {
    if (!(fetchStrategy instanceof AbstractAxiosFetchStrategy)) {
      throw new Error(
        `${HasNextPageStrategy.name} must be initialized with a FetchStrategy
           of type ${AbstractAxiosFetchStrategy.name}`
      );
    }
    return new HasNextPageStrategy(fetchStrategy);
  }

  createFetchStrategy(
    webScraper: WebScraper<Listing, Record<any, any>>
  ): IFetchStrategy<any> {
    return new JsonFetchStrategy(...this.getFetchStrategyArgs(webScraper), {
      dataJsonPath: "data",
    });
  }

  createPaginationStrategy(): IPaginationStrategy<AxiosRequestConfig> {
    return new UrlQueryParamsPaginationStrategy({
      pageStartNumber: 0,
      limitParam: "lim",
      pageParam: "page",
    });
  }

  createParseStrategy(
    webScraper: WebScraper<Listing, Record<any, any>>
  ): IParseStrategy<Record<any, any>, Listing> {
    return new BlocketParseStrategy(webScraper);
  }

  createAuthStrategy(): IAuthStrategy {
    return new NextBearerAuthStrategy({
      url: "https://www.blocket.se/",
      tokenJsonPath: "props.initialReduxState.authentication.bearerToken",
    });
  }

  getOrigin(): ListingOrigin {
    return ListingOrigin.Blocket;
  }
}
