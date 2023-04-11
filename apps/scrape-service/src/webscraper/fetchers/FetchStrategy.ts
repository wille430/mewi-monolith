import { IPagination } from "@mewi/models";

export interface FetchResult<T> {
  data: T;
  done: boolean;
}

export interface IFetchStrategy<TRet> {
  fetch(
    pagination: IPagination,
    ...additionalArgs: any[]
  ): FetchResult<TRet[]> | Promise<FetchResult<TRet[]>>;
}


