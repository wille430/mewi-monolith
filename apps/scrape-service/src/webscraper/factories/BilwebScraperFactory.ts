import { AbstractListingScraperFactory } from "./AbstractListingScraperFactory";
import { Cheerio } from "cheerio";
import { WebScraperContext } from "../context/WebScraperContext";
import { BilwebConfig, BilwebContext } from "../context/BilwebContext";
import { IFetchStrategy } from "../fetchers/FetchStrategy";
import {
  EmptyResultStrategy,
  IFetchDoneStrategy,
} from "../fetchers/FetchDoneStrategy";
import { Listing } from "@mewi/entities";
import { WebScraper } from "../WebScraper";
import { HtmlFetchStrategy } from "../fetchers/HtmlFetchStrategy";
import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import { AxiosRequestConfig } from "axios";
import { UrlQueryParamsPaginationStrategy } from "../pagination/UrlQueryParamsPaginationStrategy";
import { IParseStrategy } from "../parsers/ParseStrategy";
import { BilwebParseStrategy } from "../parsers/BilwebParseStrategy";
import { ListingOrigin } from "@mewi/models";

export class BilwebScraperFactory extends AbstractListingScraperFactory<
  Cheerio<any>
> {
  createContext(): WebScraperContext {
    return new BilwebContext();
  }

  createFetchDoneStrategy(): IFetchDoneStrategy<Listing[]> {
    return new EmptyResultStrategy();
  }

  createFetchStrategy(
    webScraper: WebScraper<Listing, Cheerio<any>>
  ): IFetchStrategy<Cheerio<any>> {
    return new HtmlFetchStrategy(...this.getFetchStrategyArgs(webScraper), {
      selector: ".Card-Wrapper > .Card",
    });
  }

  createPaginationStrategy(): IPaginationStrategy<AxiosRequestConfig> {
    return new UrlQueryParamsPaginationStrategy({
      limitParam: "limit",
      offsetParam: "offset",
    });
  }

  createParseStrategy(
    webScraper: WebScraper<Listing, Cheerio<any>>
  ): IParseStrategy<Cheerio<any>, Listing> {
    return new BilwebParseStrategy(BilwebConfig.baseUrl, webScraper);
  }

  getOrigin(): ListingOrigin {
    return ListingOrigin.Bilweb;
  }
}
