import { ListingSearchFilters } from '@wille430/common'
import { useCallback, useEffect, useRef, useState } from 'react'
import queryString from 'query-string'
import _ from 'lodash'
import { keys } from 'ts-transformer-keys'
import { useRouter } from 'next/router'
import { Category } from '@mewi/prisma/index-browser'

/**
 * Parse query string to an object with Listing filters
 *
 * @param string The query string
 * @param excludeInParams Paremeters to exclude in output object
 * @returns An object with filters
 */
export const parseSearchParams = (
    string: string,
    excludeInParams: Array<keyof ListingSearchFilters> = []
): ListingSearchFilters => {
    const unvalidatedFilters: Partial<ListingSearchFilters> = _.omit(
        _.pick(queryString.parse(string), ...keys<ListingSearchFilters>()),
        excludeInParams
    )

    const validatedFilters: ListingSearchFilters = {}

    for (const key of Object.keys(unvalidatedFilters)) {
        const value = unvalidatedFilters[key] as string | string[]

        switch (key as keyof ListingSearchFilters) {
            case 'auction':
                if (value === 'true') {
                    validatedFilters[key] = true
                }
                break
            case 'category':
                if (value.toString().toUpperCase() in Category) validatedFilters[key] = value
                break
            case 'keyword':
                validatedFilters[key] = value
                break
            case 'regions':
                if (Array.isArray(value)) {
                    // TODO validate regions
                    validatedFilters[key] = value as string[]
                } else {
                    validatedFilters[key] = [value as string]
                }
                break
            case 'page':
            case 'priceRangeGte':
            case 'priceRangeLte':
                validatedFilters[key] = parseInt(value.toString())
                break
            case 'sort':
            // TODO
        }
    }

    return validatedFilters
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

    const router = useRouter()

    const shouldUpdate = () => {
        return !_.isEqual(
            {
                ...parseSearchParams(window.location.search, excludeInParams),
                ...defaults,
            },
            _filters
        )
    }

    const [_filters, _setFilters] = useState<ListingSearchFilters>({
        ...defaults,
        ...parseSearchParams(window.location.search, excludeInParams),
    })
    const filters = useRef(_filters)

    const throttleUpdateParams = useCallback(
        _.debounce((new_filters: typeof _filters) => {
            filters.current = new_filters
            router.push(
                window.location.pathname +
                    '?' +
                    queryString.stringify(_.omit(new_filters, excludeInParams)),
                undefined,
                { shallow: true }
            )
        }, 1000),
        []
    )

    useEffect(() => {
        // On first render, update filters from URL search params
        _setFilters({
            ...parseSearchParams(window.location.search, excludeInParams),
            ...defaults,
        })
    }, [])

    useEffect(() => {
        if (shouldUpdate()) throttleUpdateParams(_filters)
    }, [_filters])

    return { filters: _filters, debouncedFilters: filters.current, setFilters: _setFilters }
}
