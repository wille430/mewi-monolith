import { AbstractAxiosFetchStrategy } from "./AbstractAxiosFetchStrategy";
import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IAuthStrategy } from "../auth/AuthStrategy";
import { WebScraper } from "../WebScraper";
import { IPagination } from "@mewi/models";
import get from "lodash/get";
import { FetchResult } from "./FetchStrategy";
import { IErrorHandler } from "../error/ErrorHandler";
import { NoErrorHandler } from "../error/NoErrorHandler";

export interface JsonFetchStrategyConfig {
  dataJsonPath: string;
}

export class JsonFetchStrategy extends AbstractAxiosFetchStrategy<
  Record<any, any>
> {
  private fetchConfig: JsonFetchStrategyConfig;

  constructor(
    paginationStrategy: IPaginationStrategy<AxiosRequestConfig>,
    authStrategy: IAuthStrategy,
    webScraper: WebScraper<any>,
    errorHandler: IErrorHandler<AxiosResponse> = new NoErrorHandler()
  ) {
    super(paginationStrategy, authStrategy, webScraper.getConfig(), errorHandler);
    this.fetchConfig = {
      dataJsonPath: webScraper.getConfig().getFetchConfig().dataJsonPath,
    };
  }

  public async fetch(
    pagination: IPagination
  ): Promise<FetchResult<Record<any, any>[]>> {
    const axiosConfig = await this.getAxiosConfig(pagination);
    const res = await axios(axiosConfig);
    const { data } = res;

    const result = get(data, this.fetchConfig.dataJsonPath);
    return {
      data: result,
      done: await this.fetchDoneStrategy.isDone(pagination, result),
      error: await this.errorHandler.isError(res),
    };
  }
}