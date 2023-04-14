import { AbstractListingScraperFactory } from "./AbstractListingScraperFactory";
import { WebScraperContext } from "../context/WebScraperContext";
import { SellpyContext } from "../context/SellpyContext";
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
import { SellpyPaginationStrategy } from "../pagination/SellpyPaginationStrategy";
import { IParseStrategy } from "../parsers/ParseStrategy";
import { SellpyParseStrategy } from "../parsers/SellpyParseStrategy";
import { ListingOrigin } from "@mewi/models";

export class SellpyScraperFactory extends AbstractListingScraperFactory<
  Record<any, any>
> {
  createContext(): WebScraperContext {
    return new SellpyContext();
  }

  createFetchDoneStrategy(): IFetchDoneStrategy<Listing[]> {
    return new LimitIsLessStrategy();
  }

  createFetchStrategy(
    webScraper: WebScraper<Listing, Record<any, any>>
  ): IFetchStrategy<Record<any, any>> {
    return new JsonFetchStrategy(...this.getFetchStrategyArgs(webScraper), {
      dataJsonPath: "results[0].hits",
    });
  }

  createPaginationStrategy(): IPaginationStrategy<AxiosRequestConfig> {
    return new SellpyPaginationStrategy();
  }

  createParseStrategy(
    webScraper: WebScraper<Listing, Record<any, any>>
  ): IParseStrategy<Record<any, any>, Listing> {
    return new SellpyParseStrategy(webScraper);
  }

  getOrigin(): ListingOrigin {
    return ListingOrigin.Sellpy;
  }
}
