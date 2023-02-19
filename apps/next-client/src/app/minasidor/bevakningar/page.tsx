import DisplayWatchers from "@/components/WatcherList/DisplayWatchers";
import { redirect } from "next/navigation";
import { UNAUTHORIZED_REDIRECT_TO } from "@/lib/constants/paths";
import { getDetailedUserWatchers } from "@/app/minasidor/bevakningar/getDetailedUserWatchers";

const Bevakningar = async () => {
  const watchers = await getDetailedUserWatchers();

  if (watchers == null) {
    redirect(UNAUTHORIZED_REDIRECT_TO);
    return null;
  }

  return (
    <main>
      <DisplayWatchers watchers={watchers} />
    </main>
  );
};

export default Bvakningar;
