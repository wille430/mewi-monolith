import { AbstractAxiosFetchStrategy } from "./AbstractAxiosFetchStrategy";
import { Cheerio, load } from "cheerio";
import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IAuthStrategy } from "../auth/AuthStrategy";
import { IPagination } from "@mewi/models";
import { FetchResult } from "./FetchStrategy";
import { IErrorHandler } from "../error/ErrorHandler";
import { NoErrorHandler } from "../error/NoErrorHandler";
import { WebScraperConfig } from "../context/WebScraperContext";

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
    errorHandler: IErrorHandler<AxiosResponse> = new NoErrorHandler(),
    config: HtmlFetchStrategyConfig
  ) {
    super(paginationStrategy, authStrategy, errorHandler);

    this.htmlConfig = { ...config };
  }

  public async fetch(
    pagination: IPagination,
    config: WebScraperConfig
  ): Promise<FetchResult<Cheerio<any>[]>> {
    const axiosConfig = await this.getAxiosConfig(pagination, config);
    const res = await axios(axiosConfig);
    const cheerio = load(res.data);

    const result = cheerio(this.htmlConfig.selector)
      .toArray()
      .map((node) => cheerio(node));
    return {
      data: result,
      done: await this.fetchDoneStrategy.isDone(pagination, result, config),
      error: await this.errorHandler.isError(res),
      url: axios.getUri(axiosConfig),
    };
  }
}
