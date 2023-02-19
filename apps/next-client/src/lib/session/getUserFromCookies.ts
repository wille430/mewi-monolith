import "server-only";
import { ReadonlyRequestCookies } from "next/dist/server/app-render";
import { UserPayload } from "@/lib/modules/common/types/UserPayload";
import { SESSION_COOKIE } from "@/lib/constants/cookies";
import { unsealData } from "iron-session";
import { sessionOptions } from "@/lib/session/sessionOptions";

export const getUserFromCookies = async (
  cookies: ReadonlyRequestCookies
): Promise<UserPayload | null> => {
  const found = cookies.get(SESSION_COOKIE);

  if (!found) return null;

  const { user } = await unsealData(found.value, {
    password: sessionOptions.password,
  });

  return user as unknown as UserPayload;
};