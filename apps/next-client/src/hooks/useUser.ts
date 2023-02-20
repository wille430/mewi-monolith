import { useAppSelector } from "./index";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useUser = ({ redirectTo = "", redirectIfFound = false } = {}) => {
  const { isLoggedIn, user, isReady } = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!redirectTo || !isReady) {
      return;
    }

    if ((!redirectIfFound && !isLoggedIn) || (redirectIfFound && isLoggedIn)) {
      router.replace(redirectTo);
    }
  }, [isLoggedIn, isReady]);

  return { user };
};
