import { ListingSearchFilters } from '@/common/types'
import {
    differenceWith,
    entries,
    flowRight,
    fromPairs,
    isEmpty,
    isEqual,
    isFunction,
    pick,
} from 'lodash'
import Router, { useRouter } from 'next/router'
import { stringify } from 'query-string'
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { ObjectSchema } from 'yup'
import { useDebounce } from './useDebounce'

export type UseSearchOptions<T = Record<string, never>> = {
    exclude?: Partial<T>
    defaultValue?: Partial<T>
}

const SearchContext = createContext<any>(null)

export const useSearchContext = <T extends Record<string, any>>(): ReturnType<
    typeof useSearch<T>
> => useContext(SearchContext)

export const useSearch = <T extends Record<string, any>>(
    schema: ObjectSchema<any, any>,
    options: UseSearchOptions<T> = {}
) => {
    const { defaultValue } = options
    const router = useRouter()
    const [filters, setFilters] = useState<T>({} as T)
    const [hasParsedQuery, setHasParsedQuery] = useState(false)

    /**
     * Debounced values
     */
    const [debouncedIsReady] = useDebounce(hasParsedQuery, 1000)
    const [debouncedFilters, setDebouncedFilters] = useDebounce(filters, undefined, {
        setInputValue: setFilters,
    })

    const setField = (field: keyof T, value: T[keyof T]) => {
        return setFilters((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const clear = () => {
        setFilters((defaultValue as T) ?? ({} as T))
    }

    const isSame = (obj1: any, obj2: any) => {
        return stringify(obj1) === stringify(obj2)
    }

    const updateQuery = () => {
        router.push(
            {
                query: stringify(filters),
            },
            undefined,
            {
                shallow: true,
            }
        )
    }

    const queryParams = pick(router.query, Object.keys(ListingSearchFilters))
    /**
     * Before url is manipulated elsewhere, this block will set filters
     * from query params
     */
    useEffect(() => {
        if (!Router.isReady || hasParsedQuery || (isEmpty(Router.query) && !router.isReady)) {
            return
        }

        setFilters({
            ...defaultValue,
            ...(schema.cast(Router.query) as any),
        })

        setHasParsedQuery(true)
    }, [queryParams])

    useEffect(() => {
        if (!hasParsedQuery || isEmpty(filters) || isSame(filters, router.query)) {
            return
        }

        updateQuery()
    }, [filters])

    const oldFilters = useRef(filters)

    /**
     * Used in composition with setFilters to set values to defaults
     * when certain fields in filters is changed. E.g. One use case
     * the page value could be set page to 1 every time the keyword
     * changes.
     */
    const setDefaults = (...args: Parameters<typeof setFilters>) => {
        const newFilters = isFunction(args[0]) ? args[0](filters) : args[0]

        const diff = fromPairs(
            differenceWith(entries(newFilters), entries(oldFilters.current), isEqual)
        )
        const diffKeys = Object.keys(diff)

        if (!(diffKeys.length === 1 && diffKeys.some((val) => val in (defaultValue ?? {})))) {
            Object.assign(newFilters, defaultValue)
        }
        oldFilters.current = newFilters

        return newFilters
    }

    return {
        filters: debouncedFilters,
        setFilters: flowRight(setFilters, setDefaults),
        setDebouncedFilters,
        setField,
        clear,
        isReady: debouncedIsReady,
    }
}

type SearchProviderProps = {
    children: ReactNode
    search: Parameters<typeof useSearch>
}

export const SearchProvider = (props: SearchProviderProps) => {
    const { children, search } = props
    const value = useSearch(...search)

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}
