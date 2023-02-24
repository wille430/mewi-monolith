import type { Dispatch } from "react";
import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { CategoryLabel, Currency, UserWatcherDto } from "@mewi/models";
import useSWR from "swr";
import { MY_WATCHERS_KEY } from "@/api-client/user-watchers/swr-keys";
import { getWatcherItems } from "@/api-client/user-watchers/queries";
import dynamic from "next/dynamic";
import Link from "next/link";
import { createSearchUrl } from "@/utils/createSearchUrl";
import { Button } from "@/components/Button/Button";
import { FiTrash } from "react-icons/fi";
import ExpandButton from "@/components/WatcherList/WatcherCard/ExpandButton/ExpandButton";

const NewItemsDrawer = dynamic(() => import("./NewItemsDrawer/NewItemsDrawer"));

interface WatcherCardProps {
  userWatcher: UserWatcherDto;
  expand: boolean;
  onExpand: Dispatch<boolean>;
  onDelete: () => any;
}

const WatcherCard = (props: WatcherCardProps) => {
  const { userWatcher, expand, onExpand, onDelete } = props;
  const { watcher } = userWatcher;
  const {
    region,
    categories,
    origins,
    keyword,
    auction,
    priceRangeLte,
    priceRangeGte,
  } = watcher.metadata;

  const listFormat = new Intl.ListFormat("sv-SE");
  const currencyFormat = new Intl.NumberFormat("sv-SE", {
    currency: Currency.SEK,
    style: "currency",
    maximumFractionDigits: 0,
  });

  const { data } = useSWR(
    expand ? [MY_WATCHERS_KEY, watcher.id] : undefined,
    () => getWatcherItems(userWatcher),
    {
      revalidateOnFocus: false,
    }
  );
  const { hits: listings } = data ?? {};

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleExpand = () => {
    onExpand(!expand);
  };

  useEffect(() => {
    if (expand)
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [expand]);

  return (
    <div className="relative z-0" ref={scrollRef}>
      <article
        className="flex flex-col card shadow-sm"
        data-testid="watcherCard"
      >
        <div className="flex flex-col text-muted space-y-2">
          <span className="font-semibold text-black">
            Sökord: "{keyword ?? ""}"
          </span>
          {region && <span>Plats: {region}</span>}
          {auction != null && <span>Auktion: {auction ? "Ja" : "Nej"}</span>}
          {categories?.length && (
            <span>
              Kategorier:{" "}
              {listFormat.format(
                categories.map((o) => CategoryLabel[o as any])
              )}
            </span>
          )}
          {origins?.length && <span>Sajter: {listFormat.format(origins)}</span>}

          {(priceRangeGte || priceRangeLte) && (
            <span>
              Prisintervall:{" "}
              {`${priceRangeGte ? currencyFormat.format(priceRangeGte) : ""}-${
                priceRangeLte ? currencyFormat.format(priceRangeLte) : ""
              }`}
            </span>
          )}
        </div>

        <div className="flex flex-row justify-end center-y space-x-2 pt-2">
          <Link
            className="btn btn-link mr-4"
            href={createSearchUrl(watcher.metadata)}
          >
            Sök med filter
          </Link>

          <Button
            data-testid="removeWatcherButton"
            className="bg-error centered rounded-full btn-sm h-6 w-6 p-0"
            onClick={onDelete}
          >
            <FiTrash color="white" />
          </Button>

          <ExpandButton handleExpand={handleExpand} expand={expand} />
        </div>
      </article>
      <AnimatePresence>
        {expand && <NewItemsDrawer listings={listings} />}
      </AnimatePresence>
    </div>
  );
};

export default WatcherCard;
