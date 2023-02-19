import { client, MutationArgs } from "../index";
import { CURRENT_USER_SWR_KEY } from "../users/swr-keys";
import { UserDto } from "@mewi/models";

export const setLikeListing = (
  listingId: string,
  value: boolean
): MutationArgs => {
  const endpoint = value ? "like" : "unlike";
  const updateFn = async (user: UserDto) => {
    await client.put(`/listings/${listingId}/${endpoint}`);

    return user;
  };

  const optimisticData = async (user: UserDto | undefined) => {
    return {
      ...user,
      likedListings: [...(user?.likedListings ?? []), listingId],
    };
  };

  return [
    CURRENT_USER_SWR_KEY,
    updateFn,
    {
      optimisticData,
    },
  ];
};
