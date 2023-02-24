import { ListingDto } from "@mewi/models";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/index";
import {client} from "@/api-client";

/**
 * Logic and state for liking and disliking listings
 * @param listing - {@link ListingDto}
 */
export const useLike = (listing: ListingDto) => {
  const [liked, setLiked] = useState(false);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    setLiked(user?.likedListings?.includes(listing.id) ?? false);
  }, [listing, user]);

  const like = useCallback(async (value: boolean) => {
    const prev = liked;
    const endpoint = value ? "like" : "unlike";

    setLiked(value);
    await client.put(`/listings/${listing.id}/${endpoint}`).catch(() => {
      setLiked(prev);
    });
  }, [listing, liked]);

  return {
    isLiked: liked,
    like
  };
};
