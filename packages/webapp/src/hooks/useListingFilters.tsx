import { ListingSearchFilters as ListingFilters } from '@wille430/common'
import React from 'react'
import queryString from 'query-string'
import _ from 'lodash'
import { keys } from 'ts-transformer-keys'
import { useRouter } from 'next/router'
import { Category } from '@mewi/prisma/index-browser'
import { ParsedUrlQuery } from 'querystring'

export interface ListingFiltersContext {
    filters: ListingFilters
    setFilters: (
        value: Parameters<React.Dispatch<React.SetStateAction<ListingFilters>>>[0],
        force?: boolean
    ) => void
    debouncedFilters: ListingFilters
    defaults: Partial<ListingFilters>
}

declare global {
    interface Window {
        ListingFilterContext: React.Context<ListingFiltersContext | undefined>
    }
}

const defaultContext = React.createContext<ListingFiltersContext | undefined>(undefined)

/**
 * Get listing filter context in memory
 *
 * @returns Listing filters context
 */
const getListingFilterContext = () => {
    if (typeof window !== 'undefined') {
        if (!window.ListingFilterContext) {
            window.ListingFilterContext = defaultContext
        }

        return window.ListingFilterContext
    }

    return defaultContext
}

export const useListingFilters = () => {
    const listingFilters = React.useContext(getListingFilterContext())

    if (!listingFilters) {
        throw new Error('No listing filter set, use ListingFilterProvider to set one')
    }

    return listingFilters
}

export const ListingFiltersProvider = ({
    children,
    defaults = {},
    excludeInParams = [],
}: {
    children: React.ReactNode
    defaults?: Partial<ListingFilters>
    excludeInParams?: Array<keyof Partial<ListingFilters>>
}) => {
    const Context = getListingFilterContext()

    const router = useRouter()

    const shouldUpdate = () => {
        return !_.isEqual(
            {
                ...parseSearchParams(router.query, excludeInParams),
                ...defaults,
            },
            _filters
        )
    }

    const updateSearchParams = (filters: ListingFilters) => {
        router.push(
            window.location.pathname +
                '?' +
                queryString.stringify(_.omit(filters, excludeInParams)),
            undefined,
            { shallow: true }
        )
    }

    const initialFilters: Partial<ListingFilters> = { page: 1 }

    const [_filters, _setFilters] = React.useState<ListingFilters>({
        ...initialFilters,
        ...defaults,
        ...parseSearchParams(router.query, excludeInParams),
    })
    const filters = React.useRef(_filters)
    const setFilters: ListingFiltersContext['setFilters'] = (value, force = false) => {
        if (force) {
            if (typeof value === 'function') {
                filters.current = value(filters.current)
            } else {
                filters.current = value
            }
            updateSearchParams(filters.current)
            console.log(`Setting filters to ${JSON.stringify(filters.current)} with debounce`)
        }
        _setFilters(value)
    }

    const throttleUpdateParams = React.useCallback(
        _.debounce((newFilters: typeof _filters) => {
            if (!_.isEqual(filters.current, newFilters)) {
                filters.current = newFilters
            }

            updateSearchParams(newFilters)
        }, 1000),
        []
    )

    React.useEffect(() => {
        // Update filters from URL search params
        if (shouldUpdate()) {
            const newFilters = {
                ...parseSearchParams(router.query, excludeInParams),
                ...defaults,
            }

            filters.current = newFilters
            _setFilters(newFilters)
        }
    }, [router.query])

    React.useEffect(() => {
        if (shouldUpdate()) throttleUpdateParams(_filters)
    }, [_filters])

    return (
        <Context.Provider
            value={{
                filters: _filters,
                debouncedFilters: filters.current,
                setFilters,
                defaults,
            }}
        >
            {children}
        </Context.Provider>
    )
}

/**
 * Parse query string to an object with Listing filters
 *
 * @param string The query string
 * @param excludeInParams Paremeters to exclude in output object
 * @returns An object with filters
 */
export const parseSearchParams = (
    query: ParsedUrlQuery,
    excludeInParams: Array<keyof ListingFilters> = []
): ListingFilters => {
    const unvalidatedFilters: Partial<ListingFilters> = _.omit(
        _.pick(query, ...keys<ListingFilters>()),
        excludeInParams
    )

    const validatedFilters: ListingFilters = {}

    for (const key of Object.keys(unvalidatedFilters)) {
        const value = unvalidatedFilters[key] as string | string[]

        if (!value) {
            continue
        }

        switch (key as keyof ListingFilters) {
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
            case 'sort':
                validatedFilters[key] = parseInt(value.toString())
                break
        }
    }

    return validatedFilters
}
