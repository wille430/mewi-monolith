import { IPagination } from "@mewi/models";
import { AbstractAxiosFetchStrategy } from "./AbstractAxiosFetchStrategy";
import axios from "axios";
import {IWebScraperConfig} from "../context/WebScraperContext"

export interface IFetchDoneStrategy<T = any[]> {
  isDone(pagination: IPagination, result: T, config: IWebScraperConfig): boolean | Promise<boolean>;
}

export class HasNextPageStrategy implements IFetchDoneStrategy {
  private fetchStrategy: AbstractAxiosFetchStrategy<any>;

  constructor(fetchStrategy: AbstractAxiosFetchStrategy<any>) {
    this.fetchStrategy = fetchStrategy;
  }

  public async isDone(pagination: IPagination, result: any, config: IWebScraperConfig): Promise<boolean> {
    pagination.page++;

    const axiosConfig = await this.fetchStrategy.getAxiosConfig(pagination, config);
    try {
      // axios will throw for 404 status code
      await axios(axiosConfig);
      return false;
    } catch (e) {
      return true;
    }
  }
}

export class LimitIsLessStrategy implements IFetchDoneStrategy {
  constructor() {}

  isDone(pagination: IPagination, res: any[]): boolean | Promise<boolean> {
    if (pagination.limit == null) {
      console.warn(
        "Limit in pagination is not set. Cannot determine if there is more to fetch"
      );
      return false;
    }

    return res.length < pagination.limit;
  }
}

export class EmptyResultStrategy implements IFetchDoneStrategy {
  isDone(pagination: IPagination, result: any[]): boolean | Promise<boolean> {
    if (result == null) {
      return true;
    }
    return result.length === 0;
  }
}

export class NeverDoneStrategy implements IFetchDoneStrategy {
  isDone(): boolean | Promise<boolean> {
    return false;
  }
}

