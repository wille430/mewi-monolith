import DisplayWatchers from "@/components/WatcherList/DisplayWatchers";
import {getUserWatchers} from "@/app/minasidor/bevakningar/getUserWatchers";
import {redirect} from "next/navigation";
import {UNAUTHORIZED_REDIRECT_TO} from "@/lib/constants/paths";

export const DisplayWatchersSsr = async () => {
    const watchers: any = await getUserWatchers();

    if (watchers == null) {
        redirect(UNAUTHORIZED_REDIRECT_TO);
        return null;
    }

    return <DisplayWatchers watchers={watchers}/>;
};