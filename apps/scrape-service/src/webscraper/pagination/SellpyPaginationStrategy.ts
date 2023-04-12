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
            indexName: "prod_marketItem_se_saleStartedAt_desc",
            params: `highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&hitsPerPage=${
              pagination.limit ?? SellpyConfig.limit
            }&filters=featuredIn%3Aa5d30f92-7dd5-49af-98ff-7079d6492e32%20OR%20featuredIn%3Af644335f-216c-455f-9610-cc6a86c85828%20OR%20featuredIn%3Ad4d52c7b-eced-4a34-bf97-6bd14ccf58db%20OR%20featuredIn%3Ae737ad9a-33f4-45ba-8d72-45f80c1c32f7%20OR%20featuredIn%3Adb9eb9fa-9ba5-417e-ad4e-eb5e1d8d5405%20OR%20featuredIn%3A4feb45d6-c228-42ee-93a5-a3b0e3454751%20AND%20price_SE.amount%20%3E%200%20AND%20(NOT%20access_SE%3Afirst%20OR%20saleType%3Ainfluencer)&clickAnalytics=true&analyticsTags=%5B%22WEB%22%2C%22Store%22%2C%22NotLoggedIn%22%5D&maxValuesPerFacet=10000&query=&page=${
              pagination.page - 1
            }&facets=%5B%22salesChannel%22%2C%22inHmResell_SE%22%2C%22inHmResell_DE%22%2C%22metadata.color%22%2C%22metadata.material%22%2C%22metadata.fabric%22%2C%22metadata.pattern%22%2C%22metadata.sleeveLength%22%2C%22metadata.neckline%22%2C%22metadata.restrictedModel%22%2C%22metadata.garmentLength%22%2C%22metadata.waistRise%22%2C%22storageSite%22%2C%22saleType%22%2C%22pricing.amount%22%2C%22promo%22%2C%22user%22%2C%22campaign%22%2C%22objectID%22%2C%22featuredIn%22%2C%22lastChance%22%2C%22sizes%22%2C%22metadata.brand%22%2C%22metadata.type%22%2C%22metadata.demography%22%2C%22metadata.condition%22%2C%22categories.lvl0%22%5D&tagFilters=`,
          },
        ],
      },
      method: "POST",
    };
  }
}

