import type { FindAllListingsDto } from "@/lib/modules/listings/dto/find-all-listing.dto";
import type { FindAllListingsResponse } from "@/lib/modules/listings/dto/find-all-listings-response.dto";
import { stringify } from "query-string";
import { client } from "../index";

export const getListings = (url, filters: FindAllListingsDto) => {
  return client.get<never, FindAllListingsResponse>(
    url + "?" + stringify(filters)
  );
};
