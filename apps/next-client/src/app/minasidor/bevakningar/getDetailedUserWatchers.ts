import { createServerSideFunc } from "@/lib/utils/createServerSideFunc";
import { DetailedUserWatcherDto } from "@mewi/models";
import { getUser } from "@/app/minasidor/getUser";
import { container } from "tsyringe";
import { UserWatchersService } from "@/lib/modules/user-watchers/user-watchers.service";
import { serialize } from "@/lib/utils/serialize";

export const getDetailedUserWatchers = createServerSideFunc(
  async (): Promise<DetailedUserWatcherDto[] | null> => {
    const user = await getUser();
    if (user == null) return null;

    const userWatchersService = container.resolve(UserWatchersService);
    return userWatchersService
      .getDetailedUserWatchers(user?.id)
      .then(serialize);
  }
);
