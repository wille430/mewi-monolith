import { AbstractListingScraperFactory } from "./AbstractListingScraperFactory";
import { AxiosRequestConfig } from "axios";
import { WebScraperContext } from "../context/WebScraperContext";
import { BlippContext } from "../context/BlippContext";
import { IFetchStrategy } from "../fetchers/FetchStrategy";
import { EmptyResultStrategy } from "../fetchers/FetchDoneStrategy";
import { WebScraper } from "../WebScraper";
import { Listing } from "@mewi/entities";
import { JsonFetchStrategy } from "../fetchers/JsonFetchStrategy";
import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import { BlippPaginationStrategy } from "../pagination/BlippPaginationStrategy";
import { IParseStrategy } from "../parsers/ParseStrategy";
import { BlippParseStrategy } from "../parsers/BlippParseStrategy";
import { ListingOrigin } from "@mewi/models";

export class BlippScraperFactory extends AbstractListingScraperFactory<
  Record<any, any>
> {
  createContext(): WebScraperContext {
    return new BlippContext();
  }

  createFetchDoneStrategy() {
    return new EmptyResultStrategy();
  }

  createFetchStrategy(
    webScraper: WebScraper<Listing, Record<any, any>>
  ): IFetchStrategy<Record<any, any>> {
    return new JsonFetchStrategy(...this.getFetchStrategyArgs(webScraper), {
      dataJsonPath: "body.payload.items",
    });
  }

  createPaginationStrategy(): IPaginationStrategy<AxiosRequestConfig> {
    return new BlippPaginationStrategy();
  }

  createParseStrategy(
    webScraper: WebScraper<Listing, Record<any, any>>
  ): IParseStrategy<Record<any, any>, Listing> {
    return new BlippParseStrategy(webScraper);
  }

  getOrigin(): ListingOrigin {
    return ListingOrigin.Blipp;
  }
}
