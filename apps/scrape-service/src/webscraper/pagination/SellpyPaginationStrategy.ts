import { IPaginationStrategy } from "./PaginationStrategy";
import { AxiosRequestConfig } from "axios";
import { IPagination } from "@mewi/models";
import { SellpyConfig } from "../context/SellpyContext";

export class SellpyPaginationStrategy
  implements IPaginationStrategy<AxiosRequestConfig>
{
  getPaginationConfig(pagination: IPagination): AxiosRequestConfig {
    return {
      data: {
        requests: [
          {
            indexName: "prod_marketItem_se_relevance",
            params: `highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&hitsPerPage=${
              SellpyConfig.limit
            }&filters=price_SE.amount%20%3E%200%20AND%20(NOT%20access_SE%3Afirst%20OR%20saleType%3Ainfluencer)&clickAnalytics=true&analyticsTags=%5B%22WEB%22%2C%22Search%22%2C%22NotLoggedIn%22%5D&maxValuesPerFacet=2000&query=&page=${
              pagination.page - 1
            }&facets=%5B%22sizes%22%2C%22metadata.brand%22%2C%22metadata.type%22%2C%22metadata.demography%22%2C%22metadata.condition%22%2C%22storageSite%22%2C%22metadata.color%22%2C%22metadata.material%22%2C%22metadata.fabric%22%2C%22metadata.pattern%22%2C%22metadata.neckline%22%2C%22metadata.sleeveLength%22%2C%22metadata.garmentLength%22%2C%22metadata.waistRise%22%2C%22metadata.restrictedModel%22%2C%22salesChannel%22%2C%22pricing.amount%22%2C%22inHmResell_SE%22%2C%22inHmResell_DE%22%2C%22promo%22%2C%22user%22%2C%22campaign%22%2C%22objectID%22%2C%22featuredIn%22%2C%22lastChance%22%2C%22categories.lvl0%22%5D&tagFilters=`,
          },
        ],
      },
      method: "POST",
    };
  }
}

