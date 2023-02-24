"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { UserWatcherDto } from "@mewi/models";
import { removeUserWatcher } from "@/api-client/user-watchers/mutations";
import { useRouter } from "next/navigation";

const WatcherCard = dynamic(() => import("./WatcherCard/WatcherCard"));

export interface DisplayWatchersProps {
  watchers: UserWatcherDto[];
}

const DisplayWatchers = (props: DisplayWatchersProps) => {
  const { watchers } = props;
  const [expandedId, setExpandedId] = useState<string | undefined>(undefined);
  const router = useRouter();

  if (watchers.length === 0) {
    return (
      <div className="centered flex-grow pb-24">
        <span className="text-sm text-muted">Du har inga bevakningar ännu</span>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    await removeUserWatcher(id);
    router.refresh();
  };

  return (
    <>
      {watchers.map((o) => (
        <WatcherCard
          key={o.id}
          userWatcher={o}
          expand={expandedId === o.id}
          onDelete={() => handleDelete(o.id)}
          onExpand={(val?: boolean) => {
            if (val) {
              setExpandedId(o.id);
            } else {
              setExpandedId(undefined);
            }
          }}
        />
      ))}
    </>
  );
};

export default DisplayWatchers;
