import { AbstractListingScraperFactory } from "./AbstractListingScraperFactory";
import { WebScraperContext } from "../context/WebScraperContext";
import { CitiboardContext } from "../context/CitiboardContext";
import { IFetchStrategy } from "../fetchers/FetchStrategy";
import {
  EmptyResultStrategy,
  IFetchDoneStrategy,
} from "../fetchers/FetchDoneStrategy";
import { Listing } from "@mewi/entities";
import { WebScraper } from "../WebScraper";
import { JsonFetchStrategy } from "../fetchers/JsonFetchStrategy";
import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import { AxiosRequestConfig } from "axios";
import { UrlQueryParamsPaginationStrategy } from "../pagination/UrlQueryParamsPaginationStrategy";
import { IParseStrategy } from "../parsers/ParseStrategy";
import { CitiboardParseStrategy } from "../parsers/CitiboardParseStrategy";
import { ListingOrigin } from "@mewi/models";

export class CitiboardScraperFactory extends AbstractListingScraperFactory<
  Record<any, any>
> {
  createContext(): WebScraperContext {
    return new CitiboardContext();
  }

  createFetchDoneStrategy(): IFetchDoneStrategy<Listing[]> {
    return new EmptyResultStrategy();
  }

  createFetchStrategy(
    webScraper: WebScraper<Listing, Record<any, any>>
  ): IFetchStrategy<Record<any, any>> {
    return new JsonFetchStrategy(...this.getFetchStrategyArgs(webScraper), {
      dataJsonPath: "annonser",
    });
  }

  createPaginationStrategy(): IPaginationStrategy<AxiosRequestConfig> {
    return new UrlQueryParamsPaginationStrategy({
      pageStartNumber: 1,
      pageParam: "sida",
    });
  }

  createParseStrategy(
    webScraper: WebScraper<Listing, Record<any, any>>
  ): IParseStrategy<Record<any, any>, Listing> {
    return new CitiboardParseStrategy(webScraper);
  }

  getOrigin(): ListingOrigin {
    return ListingOrigin.Citiboard;
  }
}
