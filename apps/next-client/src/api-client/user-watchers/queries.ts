import type { FindAllListingsResponse } from "@/lib/modules/listings/dto/find-all-listings-response.dto";
import { removeNullValues } from "@/lib/utils/removeNullValues";
import { stringify } from "query-string";
import { client } from "../index";
import { ListingDto, UserWatcherDto } from "@mewi/models";

export const getWatcherItems = async (watcher: UserWatcherDto) => {
  const query = stringify({
    dateGte: watcher.createdAt,
    limit: 5,
    ...removeNullValues(watcher.watcher.metadata),
  });

  return client.get<never, FindAllListingsResponse>("/listings?" + query);
};

export const getLikedListings = () => {
    return client.get<never, ListingDto[]>("/users/me/likes");
};
