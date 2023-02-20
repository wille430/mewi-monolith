import queryString from "query-string";
import type { Dispatch } from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./WatcherCard.module.scss";
import RemoveButton from "./RemoveWatcherButton";
import ExpandButton from "./ExpandButton/ExpandButton";
import { Button } from "@/components/Button/Button";
import {CategoryLabel, UserWatcherDto} from "@mewi/models";
import useSWR from "swr";
import {MY_WATCHERS_KEY} from "@/api-client/user-watchers/swr-keys";
import {getWatcherItems} from "@/api-client/user-watchers/queries";
import dynamic from "next/dynamic";

const NewItemsDrawer = dynamic(() => import("./NewItemsDrawer/NewItemsDrawer"));

const WatcherCard = ({
  userWatcher,
  expand,
  onExpand,
}: {
  userWatcher: UserWatcherDto;
  expand?: boolean;
  onExpand?: Dispatch<boolean>;
}) => {
  const [_expand, _setExpand] =
    expand && onExpand ? [expand, onExpand] : useState(false);
  const { watcher } = userWatcher;

  const {data} = useSWR(_expand ? [MY_WATCHERS_KEY, watcher.id] : undefined, () => getWatcherItems(userWatcher), {
    revalidateOnFocus: false
  });
  const { hits: listings } = data ?? {};

  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearchButtonClick = async () => {
    const pathname = "/sok";
    await router.push(pathname + "?" + queryString.stringify(watcher.metadata));
  };

  const handleExpand = () => {
    _setExpand(!_expand);
  };

  const regionsString = () => {
    if (typeof watcher.metadata.region === "string")
      return watcher.metadata.region;

    return watcher.metadata.region;
  };

  useEffect(() => {
    if (_expand)
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [_expand]);

  return (
    <div className={styles.watcherCardContainer} ref={scrollRef}>
      <article
        className="flex flex-col card shadow-sm"
        data-testid="watcherCard"
      >
        {watcher.metadata.keyword && (
          <header className="mb-4 flex-none">
            <label className="label">Sökord:</label>
            <span>{watcher.metadata.keyword}</span>
          </header>
        )}
        <div className="flex flex-grow space-y-4">
          <div className="grid flex-1 grid-cols-fit-12 gap-4">
            {watcher.metadata.region && watcher.metadata.region.length >= 1 ? (
              <div className="mr-6">
                <label className="label">Regioner:</label>
                <span>{regionsString()}</span>
              </div>
            ) : (
              <div></div>
            )}

            {watcher.metadata.categories ? (
              <div className="mr-6">
                <label className="label">
                  {watcher.metadata.categories.length > 1
                    ? "Kategori:"
                    : "Kategorier:"}
                </label>
                {watcher.metadata.categories.map((cat) => (
                  <span key={cat} className="mr-2">
                    {CategoryLabel[cat]}
                  </span>
                ))}
              </div>
            ) : (
              <div></div>
            )}
            {watcher.metadata.priceRangeGte ||
            watcher.metadata.priceRangeLte ? (
              <div className="mr-6">
                <label className="label">Prisintervall:</label>
                <span>
                  {(watcher.metadata.priceRangeGte || "0") +
                    "-" +
                    (watcher.metadata.priceRangeLte
                      ? watcher.metadata.priceRangeLte + "kr"
                      : "")}
                </span>
              </div>
            ) : (
              <div></div>
            )}
            {watcher.metadata.auction ? (
              <div className="mr-6">
                <label className="label">Auktion:</label>
                <span>{watcher.metadata.auction ? "Ja" : "Nej"}</span>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <footer className="mt-2 flex flex-col-reverse items-center justify-between sm:flex-row">
          <div className="w-full text-sm opacity-70 sm:w-auto">
            <label className="label">Lades till:</label>
            <span>
              {new Date(userWatcher.createdAt).toLocaleDateString("se-SV")}
            </span>
          </div>
          <div className="flex w-full justify-end space-x-2 sm:w-auto sm:justify-start">
            <Button
              onClick={handleSearchButtonClick}
              data-testid="watcherSearchButton"
              className="btn-sm"
            >
              Sök på min bevakning
            </Button>
            <RemoveButton watcherId={userWatcher.id} />

            <ExpandButton handleExpand={handleExpand} expand={_expand} />
          </div>
        </footer>
      </article>
      <AnimatePresence>
        {_expand && <NewItemsDrawer listings={listings} />}
      </AnimatePresence>
    </div>
  );
};

export default WatcherCard;
