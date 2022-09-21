import { ListingSearchFilters as ListingFilters } from '@wille430/common'
import React, { ChangeEvent, useRef } from 'react'
import queryString from 'query-string'
import { keys } from 'ts-transformer-keys'
import Router, { useRouter } from 'next/router'
import { Category, ListingOrigin } from '@mewi/prisma/index-browser'
import isEqual from 'lodash/isEqual'
import debounce from 'lodash/debounce'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import { ParsedUrlQuery } from 'querystring'
import { parseSearchParamArray } from '@/utils/parseSearchParamArray'
import { getValidEles } from '@/utils/getValidEles'

export interface ListingFiltersContext {
    filters: ListingFilters
    setField: (e: ChangeEvent<HTMLInputElement>) => void
    setFilters: (
        value: Parameters<React.Dispatch<React.SetStateAction<ListingFilters>>>[0],
        force?: boolean
    ) => void
    debouncedFilters: ListingFilters
    defaults: Partial<ListingFilters>
    clear: () => void
}

declare global {
    interface Window {
        ListingFilterContext: React.Context<ListingFiltersContext | undefined>
    }
}

const defaultContext = React.createContext<ListingFiltersContext | undefined>(undefined)

/**
 * Get listing filter context from the memory
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

export const removeUndefinedValues = (o: Record<any, any>) => {
    for (const [key, value] of Object.entries(o)) {
        if (value === undefined) {
            delete o[key]
        }
    }
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
    const isFirstRender = useRef(true)

    const shouldUpdate = () => {
        return !isEqual(
            {
                ...parseSearchParams(router.query, excludeInParams),
                ...defaults,
            },
            _filters
        )
    }

    const updateSearchParams = (filters: ListingFilters) => {
        Router.push(
            window.location.pathname + '?' + queryString.stringify(omit(filters, excludeInParams)),
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
        }
        _setFilters(value)
    }

    const changedFilterValues = (oldFilters: ListingFilters, newFilters: ListingFilters) => {
        const changedKeys: string[] = []
        for (const key of Object.keys({ ...oldFilters, newFilters })) {
            if (oldFilters[key] !== newFilters[key]) {
                changedKeys.push(key)
            }
        }

        return changedKeys
    }

    const throttleUpdateParams = React.useCallback(
        debounce((newFilters: typeof _filters) => {
            if (!isEqual(filters.current, newFilters)) {
                removeUndefinedValues(newFilters)
                if (!isEqual(changedFilterValues(filters.current, newFilters), ['page'])) {
                    newFilters.page = 1
                    filters.current = newFilters
                }
            }

            updateSearchParams(newFilters)
        }, 1000),
        [filters.current]
    )

    const setField = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const clear = () => {
        setFilters(initialFilters)
    }

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
        if (shouldUpdate() && !isFirstRender.current) throttleUpdateParams(_filters)

        if (isFirstRender.current) {
            isFirstRender.current = false
        }
    }, [_filters])

    return (
        <Context.Provider
            value={{
                filters: _filters,
                debouncedFilters: filters.current,
                setFilters,
                setField,
                defaults,
                clear,
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
    const unvalidatedFilters: Partial<ListingFilters> = omit(
        pick(query, ...keys<ListingFilters>()),
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
            case 'categories':
                const categories = parseSearchParamArray(value) as Category[]
                validatedFilters.categories = getValidEles(categories, Object.keys(Category))
                break
            case 'origins':
                const origins = parseSearchParamArray(value) as ListingOrigin[]
                validatedFilters.origins = getValidEles(origins, Object.keys(ListingOrigin))
                break
            case 'keyword':
            case 'region':
                validatedFilters[key] = value
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

export const stringifySearchPath = (filters: ListingFilters) => {
    const excludeFilters: (keyof ListingFilters)[] = []

    const omittedFilters = omit(filters, excludeFilters)

    let path = '/sok'

    if (Object.keys(omittedFilters).length) {
        path += `?${queryString.stringify(omittedFilters)}`
    }

    return path
}
