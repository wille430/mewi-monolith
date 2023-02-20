import DisplayWatchers from "@/components/WatcherList/DisplayWatchers";
import { redirect } from "next/navigation";
import { UNAUTHORIZED_REDIRECT_TO } from "@/lib/constants/paths";
import { getUserWatchers } from "@/app/minasidor/bevakningar/getUserWatchers";

const Bevakningar = async () => {
  const watchers = await getUserWatchers();

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

export default Bevakningar;
