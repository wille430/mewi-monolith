import { IPagination } from "@mewi/models";
import { IWebScraperConfig } from "../context/WebScraperContext";
import { IFetchDoneStrategy } from "./FetchDoneStrategy";

export interface FetchResult<T> {
  data: T;
  done: boolean;
  error: boolean;
  url: string;
}

export interface IFetchStrategy<TRet> {
  fetch(
    pagination: IPagination,
    config: IWebScraperConfig
  ): FetchResult<TRet[]> | Promise<FetchResult<TRet[]>>;

  setFetchDoneStrategy(fetchDoneStrategy: IFetchDoneStrategy): typeof this;
}
