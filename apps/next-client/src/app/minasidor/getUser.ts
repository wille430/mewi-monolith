import "server-only";
import "reflect-metadata";
import { getUserFromCookies } from "@/lib/session/getUserFromCookies";
import { cookies } from "next/headers";
import { UserDto } from "@mewi/models";
import { container } from "tsyringe";
import { UsersService } from "@/lib/modules/users/users.service";
import { User } from "@mewi/entities";
import { createServerSideFunc } from "@/lib/utils/createServerSideFunc";

export const getUser = createServerSideFunc(
  async (): Promise<UserDto | null> => {
    const payload = await getUserFromCookies(cookies());
    if (payload == null) return null;

    const usersService = await container.resolve(UsersService);
    const user = await usersService.findOne(payload.userId);
    return user ? User.convertToDto(user) : user;
  }
);
