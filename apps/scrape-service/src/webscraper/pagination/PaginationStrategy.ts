import { IPagination } from "@mewi/models";

export interface IPaginationStrategy<T> {
  getPaginationConfig(pagination: IPagination): T;
}

