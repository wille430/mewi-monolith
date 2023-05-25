import "server-only";
import WatcherPopUpButton from "@/components/WatcherList/WatcherPopUpButton";
import { DisplayWatchersSsr } from "@/app/minasidor/bevakningar/DisplayWatchersSsr";
import { Suspense } from "react";
import DisplayWatchersSkeleton from "@/components/WatcherList/DisplayWatchersSkeleton";

const Bevakningar = async () => {
  return (
    <main>
      <section
        className={"card flex flex-col"}
        style={{
          minHeight: "36rem",
        }}
      >
        <h3>Mina bevakningar</h3>
        <hr />
        <div className="flex flex-col flex-grow space-y-4">
          <Suspense fallback={<DisplayWatchersSkeleton />}>
            {/* @ts-expect-error */}
            <DisplayWatchersSsr />
          </Suspense>
        </div>
        <hr />
        <div className="flex justify-end">
          <WatcherPopUpButton data-testid="createNewWatcherButton" />
        </div>
      </section>
    </main>
  );
};

export default Bevakningar;
