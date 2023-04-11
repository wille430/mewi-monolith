import { AbstractAxiosFetchStrategy } from "./AbstractAxiosFetchStrategy";
import { IPaginationStrategy } from "../pagination/PaginationStrategy";
import axios, { AxiosRequestConfig } from "axios";
import { IAuthStrategy } from "../auth/AuthStrategy";
import { WebScraper } from "../WebScraper";
import { IPagination } from "@mewi/models";
import get from "lodash/get";
import { FetchResult } from "./FetchStrategy";

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
    webScraper: WebScraper<any>
  ) {
    super(paginationStrategy, authStrategy, webScraper.getConfig());
    this.fetchConfig = {
      dataJsonPath: webScraper.getConfig().getFetchConfig().dataJsonPath,
    };
  }

  public async fetch(
    pagination: IPagination
  ): Promise<FetchResult<Record<any, any>[]>> {
    const { data } = await axios(await this.getAxiosConfig(pagination));
    const result = get(data, this.fetchConfig.dataJsonPath);
    return {
      data: result,
      done: await this.fetchDoneStrategy.isDone(pagination, result),
    };
  }
}