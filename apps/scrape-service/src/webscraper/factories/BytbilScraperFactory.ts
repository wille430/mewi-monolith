import {AbstractListingScraperFactory} from "./AbstractListingScraperFactory";
import {Cheerio} from "cheerio";
import {AxiosRequestConfig} from "axios";
import {WebScraperContext} from "../context/WebScraperContext";
import {BytbilConfig, BytbilContext} from "../context/BytbilContext";
import {IFetchStrategy} from "../fetchers/FetchStrategy";
import {EmptyResultStrategy} from "../fetchers/FetchDoneStrategy";
import {WebScraper} from "../WebScraper";
import {Listing} from "@mewi/entities";
import {HtmlFetchStrategy} from "../fetchers/HtmlFetchStrategy";
import {IPaginationStrategy} from "../pagination/PaginationStrategy";
import {UrlQueryParamsPaginationStrategy} from "../pagination/UrlQueryParamsPaginationStrategy";
import {IParseStrategy} from "../parsers/ParseStrategy";
import {BytbilParseStrategy} from "../parsers/BytbilParseStrategy";
import {ListingOrigin} from "@mewi/models";

export class BytbilScraperFactory extends AbstractListingScraperFactory<
    Cheerio<any>,
    AxiosRequestConfig
> {
    createContext(): WebScraperContext {
        return new BytbilContext();
    }

    createFetchDoneStrategy(fetchStrategy: IFetchStrategy<Cheerio<any>>) {
        return new EmptyResultStrategy();
    }

    createFetchStrategy(
        webScraper: WebScraper<Listing, Cheerio<any>>
    ): IFetchStrategy<Cheerio<any>> {
        return new HtmlFetchStrategy(
            ...this.getFetchStrategyArgs(webScraper)
        ).setFetchDoneStrategy(this.createFetchDoneStrategy);
    }

    createPaginationStrategy(): IPaginationStrategy<AxiosRequestConfig> {
        return new UrlQueryParamsPaginationStrategy({
            pageStartNumber: 1,
        });
    }

    createParseStrategy(
        webScraper: WebScraper<Listing, Cheerio<any>>
    ): IParseStrategy<Cheerio<any>, Listing> {
        return new BytbilParseStrategy(BytbilConfig.baseUrl, webScraper);
    }

    getOrigin(): ListingOrigin {
        return ListingOrigin.Bytbil;
    }
}