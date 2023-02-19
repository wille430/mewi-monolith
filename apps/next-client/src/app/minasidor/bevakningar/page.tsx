"use client";
import WatcherList from "@/components/WatcherList/WatcherList";
import {withAuthorized} from "@/hocs/withAuthorized";

const Bevakningar = () => {
    return (
        <main>
            <WatcherList/>
        </main>
    );
};

export default withAuthorized(Bevakningar);
