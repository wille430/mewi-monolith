import { ListingSearchFilters } from '@/common/types'
import { debounce } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import { getListings } from '../client/listings/queries'
import { LISTINGS_KEY } from '../client/listings/swr-keys'
import { useSearchContext } from './useSearch'

export const useListingsSearch = () => {
    const { filters } = useSearchContext<ListingSearchFilters>()

    const [realFilters, setRealFilters] = useState<ListingSearchFilters>()

    const updateRealFilters = useCallback(
        debounce(() => {
            setRealFilters(filters)
        }, 1000),
        [filters]
    )

    useEffect(() => {
        updateRealFilters()

        setRealFilters((prev) => ({
            ...prev,
            page: filters.page,
            sort: filters.sort,
        }))
    }, [filters])

    return useSWR([LISTINGS_KEY, realFilters], () => getListings(realFilters ?? {}))
}
