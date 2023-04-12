import { IPaginationStrategy } from "./PaginationStrategy";
import { AxiosRequestConfig } from "axios";
import { IPagination } from "@mewi/models";
import { set } from "lodash";

export interface RequestBodyPaginationStrategyConfig {
  limitPath?: string;
  offsetPath?: string;
  pagePath?: string;
  defaultLimit?: number;
  data?: any;
}

export class RequestBodyPaginationStrategy
  implements IPaginationStrategy<AxiosRequestConfig>
{
  private config: RequestBodyPaginationStrategyConfig;

  constructor(config: RequestBodyPaginationStrategyConfig) {
    this.config = config;

    if (
      (this.config.offsetPath == null && this.config.pagePath == null) ||
      (this.config.offsetPath != null && this.config.pagePath != null)
    )
      throw new Error(
        "Either offsetPath or pagePath must be defined, not both."
      );
  }

  getPaginationConfig(pagination: IPagination): AxiosRequestConfig {
    const limit = pagination.limit ?? this.config.defaultLimit;
    const config = { data: this.config.data ?? {} };

    if (limit != null && this.config.limitPath)
      set(config, this.config.limitPath, limit);

    if (this.config.offsetPath != null && limit != null && pagination.page) {
      set(config, this.config.offsetPath, (pagination.page - 1) * limit);
    } else if (this.config.pagePath != null && pagination.page) {
      set(config, this.config.pagePath, pagination.page);
    }

    return config;
  }
}