import "server-only";
import { UserPayload } from "@/lib/modules/common/types/UserPayload";
import { SESSION_COOKIE } from "@/lib/constants/cookies";
import { unsealData } from "iron-session";
import { sessionOptions } from "@/lib/session/sessionOptions";
import { cookies } from "next/headers";

export const getUserFromCookies = async (
  cookiesList: ReturnType<typeof cookies>
): Promise<UserPayload | null> => {
  const found = cookiesList.get(SESSION_COOKIE);

  if (!found) return null;

  const { user } = await unsealData(found.value, {
    password: sessionOptions.password,
  });

  return user as unknown as UserPayload;
};
