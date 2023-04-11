import { AbstractAxiosFetchStrategy } from "./AbstractAxiosFetchStrategy";
import { Cheerio, load } from "cheerio";
import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import axios, { AxiosRequestConfig } from "axios";
import { IAuthStrategy } from "../auth/AuthStrategy";
import { WebScraper } from "../WebScraper";
import { IPagination } from "@mewi/models";
import { FetchResult } from "./FetchStrategy";

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
    webScraper: WebScraper<any>
  ) {
    const { selector } = webScraper.getConfig().getFetchConfig();
    super(paginationStrategy, authStrategy, webScraper.getConfig());
    this.htmlConfig = { selector };
  }

  public async fetch(
    pagination: IPagination
  ): Promise<FetchResult<Cheerio<any>[]>> {
    const { data } = await axios(await this.getAxiosConfig(pagination));
    const $ = load(data);

    const result = $(this.htmlConfig.selector)
      .toArray()
      .map((node) => $(node));
    return {
      data: result,
      done: await this.fetchDoneStrategy.isDone(pagination, result),
    };
  }
}