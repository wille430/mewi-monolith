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
            filters: {} as ListingSearchFilters,
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
        _.debounce((newFilters: typeof _filters) => {
            filters.current = newFilters
            router.push(
                window.location.pathname +
                    '?' +
                    queryString.stringify(_.omit(newFilters, excludeInParams)),
                undefined,
                { shallow: true }
            )
        }, 1000),
        []
    )

    useEffect(() => {
        // Update filters from URL search params
        if (shouldUpdate()) {
            const newFilters = {
                ...parseSearchParams(window.location.search, excludeInParams),
                ...defaults,
            }

            filters.current = newFilters
            _setFilters(newFilters)
        }
    }, [router.query])

    useEffect(() => {
        if (shouldUpdate()) throttleUpdateParams(_filters)
    }, [_filters])

    return { filters: _filters, debouncedFilters: filters.current, setFilters: _setFilters }
}
