import { ListingSearchFilters } from '@wille430/common'
import { useCallback, useEffect, useState } from 'react'
import queryString from 'query-string'
import _ from 'lodash'
import { keys } from 'ts-transformer-keys'

export const parseSearchParams = (string: string): ListingSearchFilters => {
    const unvalidatedFilters = _.pick(
        queryString.parse(string),
        ...Object.keys(keys<ListingSearchFilters>())
    )

    return unvalidatedFilters
}

export const useListingFilters = (
    defaults: Partial<ListingSearchFilters> = {},
    excludeInParams: Array<keyof ListingSearchFilters> = []
) => {
    // eslint-disable-next-line no-constant-condition
    if (typeof window === 'undefined') {
        return {
            filters: {},
        }
    }

    const [filters, _setFilters] = useState<ListingSearchFilters>({
        ...defaults,
        ...parseSearchParams(window.location.search),
    })

    const debouncedSetSearchParams = useCallback(
        _.debounce(() => {
            window.location.search = queryString.stringify(_.omit(filters, excludeInParams))
        }, 500),
        [filters]
    )

    useEffect(() => {
        _setFilters({
            ..._.omit(parseSearchParams(window.location.search), excludeInParams),
            ...defaults,
        })
    }, [window.location.search])

    useEffect(() => {
        if (
            !_.isEqual(
                {
                    ..._.omit(parseSearchParams(window.location.search), excludeInParams),
                    ...defaults,
                },
                filters
            )
        )
            debouncedSetSearchParams()
    }, [filters])

    return { filters, setFilters: _setFilters }
}
