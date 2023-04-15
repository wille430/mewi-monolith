import { AxiosRequestConfig } from "axios";
import { IPagination } from "@mewi/models";
import { IPaginationStrategy } from "./PaginationStrategy";

export interface UrlQueryParamsPaginationStrategyConfig {
  pageParam: string;
  pageStartNumber: number;
  limitParam?: string;
  offsetParam?: string;
  defaultLimit?: number;
}

export class UrlQueryParamsPaginationStrategy
  implements IPaginationStrategy<AxiosRequestConfig>
{
  private readonly config: UrlQueryParamsPaginationStrategyConfig;

  private static readonly defaultConfig: UrlQueryParamsPaginationStrategyConfig =
    {
      pageParam: "page",
      pageStartNumber: 1,
      defaultLimit: 60,
    };

  constructor(config: Partial<UrlQueryParamsPaginationStrategyConfig> = {}) {
    this.config = Object.assign(
      UrlQueryParamsPaginationStrategy.defaultConfig,
      config
    );
  }

  getPaginationConfig(pagination: IPagination): AxiosRequestConfig {
    const paramObj = {};

    pagination.limit ??= this.config.defaultLimit;

    paramObj[this.config.pageParam] =
      pagination.page - (1 - this.config.pageStartNumber);

    if (this.config.limitParam) {
      paramObj[this.config.limitParam] = pagination.limit;
    }

    if (this.config.offsetParam) {
      paramObj[this.config.offsetParam] =
        (pagination.page - 1) * pagination.limit;
    }

    const params = new URLSearchParams(paramObj);
    return { params };
  }
}
