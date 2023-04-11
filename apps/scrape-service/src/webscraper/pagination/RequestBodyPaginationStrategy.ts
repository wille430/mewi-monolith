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
    const config = { data: this.config.data ?? {} };

    if (pagination.limit && this.config.limitPath)
      set(config, this.config.limitPath, pagination.limit);

    if (
      this.config.offsetPath != null &&
      this.config.defaultLimit &&
      pagination.page
    ) {
      set(
        config,
        this.config.offsetPath,
        (pagination.page - 1) * this.config.defaultLimit
      );
    } else if (this.config.pagePath != null && pagination.page) {
      set(config, this.config.pagePath, pagination.page);
    }

    return config;
  }
}