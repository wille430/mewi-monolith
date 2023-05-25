import "server-only";
import { container } from "tsyringe";
import { getUserFromCookies } from "@/lib/session/getUserFromCookies";
import { cookies } from "next/headers";
import { serialize } from "@/lib/utils/serialize";
import { Listing } from "@mewi/entities";
import { createServerSideFunc } from "@/lib/utils/createServerSideFunc";
import { UsersService } from "@/lib/modules/users/users.service";

export const getLikedListings = createServerSideFunc(async () => {
  const usersService = await container.resolve(UsersService);
  const user = await getUserFromCookies(cookies());
  if (!user) {
    return null;
  }

  const listings = await usersService.getLikedListings(user.userId);
  return serialize(listings.map((o) => Listing.convertToDto(o)));
});
