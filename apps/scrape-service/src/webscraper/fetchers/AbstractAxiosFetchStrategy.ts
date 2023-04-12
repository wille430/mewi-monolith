import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import { AxiosRequestConfig } from "axios";
import { IAuthStrategy } from "../auth/AuthStrategy";
import { IWebScraperConfig } from "../config/WebScraperContext";
import { IPagination } from "@mewi/models";
import { FetchResult, IFetchStrategy } from "./FetchStrategy";
import { IFetchDoneStrategy, NeverDoneStrategy } from "./FetchDoneStrategy";
import { merge } from "lodash";

export interface HttpFetchStrategyConfig {
  url: string;
  method: string;
  data?: any;
}

export abstract class AbstractAxiosFetchStrategy<TRet>
  implements IFetchStrategy<TRet>
{
  protected paginationStrategy: IPaginationStrategy<AxiosRequestConfig>;
  protected fetchDoneStrategy: IFetchDoneStrategy;
  protected authStrategy: IAuthStrategy;
  protected config: HttpFetchStrategyConfig;
  private static readonly defaultConfig: HttpFetchStrategyConfig = {
    url: null,
    method: "GET",
  };

  protected constructor(
    paginationStrategy: IPaginationStrategy<AxiosRequestConfig>,
    authStrategy: IAuthStrategy,
    webScraperConfig: IWebScraperConfig<Partial<HttpFetchStrategyConfig> & any>
  ) {
    this.paginationStrategy = paginationStrategy;
    this.authStrategy = authStrategy;
    this.setConfig(webScraperConfig);

    if (this.config.url == null)
      throw new Error(`url must be defined in HttpFetchStrategyConfig`);

    if (this.fetchDoneStrategy == null)
      this.fetchDoneStrategy = new NeverDoneStrategy();
  }

  abstract fetch(
    pagination: IPagination
  ): FetchResult<TRet[]> | Promise<FetchResult<TRet[]>>;

  public async getAxiosConfig(
    pagination: IPagination
  ): Promise<AxiosRequestConfig> {
    const paginationConfig =
      this.paginationStrategy.getPaginationConfig(pagination);

    const defaultConfig: AxiosRequestConfig = {
      url: this.config.url,
      method: this.config.method,
    };

    const axiosConfig = Object.assign(defaultConfig, paginationConfig);

    await this.authStrategy.addAuth(axiosConfig);

    return axiosConfig;
  }

  private setConfig(
    config: IWebScraperConfig<Partial<HttpFetchStrategyConfig> & any>
  ) {
    this.config = merge(
      {},
      AbstractAxiosFetchStrategy.defaultConfig,
      config.getFetchConfig()
    );

    this.config.url = config.getUrl();
  }

  public getFetchConfig() {
    return this.config;
  }

  public setFetchDoneStrategy(
    fetchDoneStrategy: (fetchStrategy: typeof this) => IFetchDoneStrategy
  ): typeof this {
    this.fetchDoneStrategy = fetchDoneStrategy(this);
    return this;
  }
}