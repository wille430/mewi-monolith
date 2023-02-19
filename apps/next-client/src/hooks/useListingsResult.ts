import {ListingSearchFilters} from "@/common/types/ListingSearchFilters";
import useSWR from "swr";
import {getListings} from "@/client/listings/queries";
import {LISTINGS_KEY} from "@/client/listings/swr-keys";
import {useSearchContext} from "@/context/SearchContext";

export const useListingsSearch = () => {
    const {filters, isReady} = useSearchContext<ListingSearchFilters>();

    return useSWR(isReady ? [LISTINGS_KEY, filters] : null, getListings, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
    });
};
