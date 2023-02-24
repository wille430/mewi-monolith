import { createServerSideFunc } from "@/lib/utils/createServerSideFunc";
import { UserWatcherDto } from "@mewi/models";
import { getUser } from "@/app/minasidor/getUser";
import { container } from "tsyringe";
import { UserWatchersService } from "@/lib/modules/user-watchers/user-watchers.service";
import { serialize } from "@/lib/utils/serialize";

export const getUserWatchers = createServerSideFunc(
  async (): Promise<UserWatcherDto[] | null> => {
    const user = await getUser();
    if (user == null) return null;

    const userWatchersService = container.resolve(UserWatchersService);
    return userWatchersService.getFromUser(user.id).then(serialize);
  }
);
