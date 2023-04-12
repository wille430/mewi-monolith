import { IPaginationStrategy } from "./PaginationStrategy";
import { AxiosRequestConfig } from "axios";
import { IPagination } from "@mewi/models";
import { BlippConfig } from "../context/BlippContext";

export class BlippPaginationStrategy
  implements IPaginationStrategy<AxiosRequestConfig>
{
  getPaginationConfig(pagination: IPagination): AxiosRequestConfig {
    return {
      url: "https://blipp.se/api/proxy",
      data: {
        method: "getMarketplaceAds",
        payload: {
          params: `filters%5Btag%5D=&sort%5Bcolumn%5D=published_date&sort%5Border%5D=desc&page=${
            pagination.page
          }&per_page=${pagination.limit ?? BlippConfig.limit}`,
        },
      },
    };
  }
}
