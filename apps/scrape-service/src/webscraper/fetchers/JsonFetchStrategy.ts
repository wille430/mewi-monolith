import {
  AbstractAxiosFetchStrategy,
  HttpFetchStrategyConfig,
} from "./AbstractAxiosFetchStrategy";
import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IAuthStrategy } from "../auth/AuthStrategy";
import { IPagination } from "@mewi/models";
import get from "lodash/get";
import { FetchResult } from "./FetchStrategy";
import { IErrorHandler } from "../error/ErrorHandler";
import { WebScraperConfig } from "../context/WebScraperContext";

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
    errorHandler: IErrorHandler<AxiosResponse>,
    fetchConfig: Partial<HttpFetchStrategyConfig> & JsonFetchStrategyConfig
  ) {
    super(paginationStrategy, authStrategy, errorHandler);

    this.fetchConfig = {
      dataJsonPath: fetchConfig.dataJsonPath,
    };
  }

  public async fetch(
    pagination: IPagination,
    config: WebScraperConfig
  ): Promise<FetchResult<Record<any, any>[]>> {
    const axiosConfig = await this.getAxiosConfig(pagination, config);
    const res = await axios(axiosConfig);
    const { data } = res;

    const result = get(data, this.fetchConfig.dataJsonPath);
    return {
      data: result,
      done: await this.fetchDoneStrategy.isDone(pagination, result, config),
      error: await this.errorHandler.isError(res),
      url: axios.getUri(axiosConfig),
    };
  }
}
