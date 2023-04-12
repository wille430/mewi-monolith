import { AbstractAxiosFetchStrategy } from "./AbstractAxiosFetchStrategy";
import { Cheerio, load } from "cheerio";
import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IAuthStrategy } from "../auth/AuthStrategy";
import { WebScraper } from "../WebScraper";
import { IPagination } from "@mewi/models";
import { FetchResult } from "./FetchStrategy";
import { IErrorHandler } from "../error/ErrorHandler";
import { NoErrorHandler } from "../error/NoErrorHandler";

export interface HtmlFetchStrategyConfig {
  selector: string;
}

export class HtmlFetchStrategy extends AbstractAxiosFetchStrategy<
  Cheerio<any>
> {
  private readonly htmlConfig: HtmlFetchStrategyConfig;

  constructor(
    paginationStrategy: IPaginationStrategy<AxiosRequestConfig>,
    authStrategy: IAuthStrategy,
    webScraper: WebScraper<any>,
    errorHandler: IErrorHandler<AxiosResponse> = new NoErrorHandler()
  ) {
    const { selector } = webScraper.getConfig().getFetchConfig();
    super(
      paginationStrategy,
      authStrategy,
      webScraper.getConfig(),
      errorHandler
    );
    this.htmlConfig = { selector };
  }

  public async fetch(
    pagination: IPagination
  ): Promise<FetchResult<Cheerio<any>[]>> {
    const res = await axios(await this.getAxiosConfig(pagination));
    const $ = load(res.data);

    const result = $(this.htmlConfig.selector)
      .toArray()
      .map((node) => $(node));
    return {
      data: result,
      done: await this.fetchDoneStrategy.isDone(pagination, result),
      error: await this.errorHandler.isError(res),
    };
  }
}