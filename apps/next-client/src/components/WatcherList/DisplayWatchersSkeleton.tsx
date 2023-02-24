"use client";
import { WatcherCardSkeleton } from "@/components/WatcherList/WatcherCard/WatcherCardSkeleton";

const DisplayWatchers = () => {
  const watchers = new Array(3).fill(null);

  return (
    <>
      {watchers.map(() => (
        <WatcherCardSkeleton />
      ))}
    </>
  );
};

export default DisplayWatchers;
