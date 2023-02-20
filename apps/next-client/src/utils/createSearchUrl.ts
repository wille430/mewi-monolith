import { ListingSearchFilters } from "@/common/types/ListingSearchFilters";
import { stringify } from "query-string";

export const createSearchUrl = (
  filters: ListingSearchFilters,
  path = "/sok"
) => {
  return `${path}?${stringify(filters)}`;
};
