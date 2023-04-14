import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IAuthStrategy } from "../auth/AuthStrategy";
import { IPagination } from "@mewi/models";
import { FetchResult, IFetchStrategy } from "./FetchStrategy";
import { IFetchDoneStrategy, NeverDoneStrategy } from "./FetchDoneStrategy";
import { IErrorHandler } from "../error/ErrorHandler";
import { NoErrorHandler } from "../error/NoErrorHandler";
import { IWebScraperConfig } from "../context/WebScraperContext";

export interface HttpFetchStrategyConfig {
  data?: any;
}

export abstract class AbstractAxiosFetchStrategy<TRet>
  implements IFetchStrategy<TRet>
{
  protected paginationStrategy: IPaginationStrategy<AxiosRequestConfig>;
  protected fetchDoneStrategy: IFetchDoneStrategy;
  protected authStrategy: IAuthStrategy;
  protected errorHandler: IErrorHandler<AxiosResponse>;
  private static readonly defaultConfig: HttpFetchStrategyConfig = {};

  protected constructor(
    paginationStrategy: IPaginationStrategy<AxiosRequestConfig>,
    authStrategy: IAuthStrategy,
    errorHandler: IErrorHandler<AxiosResponse> = new NoErrorHandler()
  ) {
    this.paginationStrategy = paginationStrategy;
    this.authStrategy = authStrategy;
    this.errorHandler = errorHandler;

    if (this.fetchDoneStrategy == null) {
      this.fetchDoneStrategy = new NeverDoneStrategy();
    }
  }

  abstract fetch(
    pagination: IPagination,
    config: IWebScraperConfig
  ): FetchResult<TRet[]> | Promise<FetchResult<TRet[]>>;

  public async getAxiosConfig(
    pagination: IPagination,
    config: IWebScraperConfig
  ): Promise<AxiosRequestConfig> {
    const paginationConfig = await this.paginationStrategy.getPaginationConfig(
      pagination
    );

    const defaultConfig: AxiosRequestConfig = {
      ...AbstractAxiosFetchStrategy.defaultConfig,
      url: config.getUrl(),
      method: config.getMethod(),
    };

    const axiosConfig = Object.assign({}, defaultConfig, paginationConfig);

    await this.authStrategy.addAuth(axiosConfig);

    return axiosConfig;
  }

  public setFetchDoneStrategy(
    fetchDoneStrategy: IFetchDoneStrategy
  ): typeof this {
    this.fetchDoneStrategy = fetchDoneStrategy;
    return this;
  }
}
