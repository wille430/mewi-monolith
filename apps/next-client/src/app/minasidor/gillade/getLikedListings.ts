import { dbConnection } from "@/lib/dbConnection";
import { container } from "tsyringe";
import { UsersService } from "@/lib/modules/users/users.service";
import { getUserFromCookies } from "@/lib/session/getUserFromCookies";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/app-render";
import { serialize } from "@/lib/utils/serialize";
import { Listing } from "@mewi/entities";

export const getLikedListings = async () => {
  await dbConnection();
  const usersService = await container.resolve(UsersService);
  const user = await getUserFromCookies(cookies() as ReadonlyRequestCookies);

  if (!user) {
    return null;
  }

  const listings = await usersService.getLikedListings(user.userId);
  return serialize(listings.map((o) => Listing.convertToDto(o)));
};
