"use client"
import differenceWith from 'lodash/differenceWith'
import toPairs from 'lodash/toPairs'
import flow from 'lodash/flow'
import isEqual from 'lodash/isEqual'
import isFunction from 'lodash/isFunction'
import fromPairs from 'lodash/fromPairs'
import {ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams} from 'next/navigation'
import {stringify} from 'query-string'
import {createContext, ReactNode, useContext, useEffect, useState} from 'react'
import {ObjectSchema} from 'yup'
import {useDebounce} from '@/hooks/useDebounce'
import {FormikProvider, useFormik} from 'formik'
import noop from 'lodash/noop'
import {removeNullValues} from "@/lib/utils/removeNullValues"
import {searchParamsToObject} from "@mewi/utilities"

export type UseSearchOptions<T = Record<string, never>> = {
    exclude?: Partial<T>
    defaultValue?: Partial<T>
}

const SearchContext = createContext<any>(null)

export const useSearchContext = <T extends Record<string, any>>(): ReturnType<
    typeof useSearch<T>
> => useContext(SearchContext)

const useSearch = <T extends Record<string, any>>(
    schema: ObjectSchema<any, any>,
    options: UseSearchOptions<T> = {}
) => {
    const {defaultValue} = options
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()
    const [hasParsedQuery, setHasParsedQuery] = useState(false)

    const formik = useFormik<T>({
        initialValues: (defaultValue ?? {}) as T,
        onSubmit: noop,
    })
    const {values: filters, setValues: setFilters} = formik

    /**
     * Used in composition with setFilters to set values to defaults
     * when certain fields in filters is changed. E.g. One use case
     * the page value could be set page to 1 every time the keyword
     * changes.
     */
    const setDefaults = (...args: Parameters<typeof setFilters>) => {
        const newFilters = isFunction(args[0]) ? args[0](filters) : args[0]
        const diff = fromPairs(differenceWith(toPairs(newFilters), toPairs(filters), isEqual))
        const diffKeys = Object.keys(diff)

        if (!(diffKeys.length === 1 && diffKeys.some((val) => val in (defaultValue ?? {})))) {
            Object.assign(newFilters, defaultValue)
        }
        return newFilters
    }

    // Get filters from query
    useEffect(() => {
        params && setFilters(parseQuery(params))
        setHasParsedQuery(true)
    }, [])

    const castToSchema = (obj: T) => schema.cast(obj, {stripUnknown: true})
    const parseQuery = (params: ReadonlyURLSearchParams | null): T => params ? flow(searchParamsToObject, castToSchema, setDefaults)(params) : defaultValue
    const validateFilters = (filters: T) => flow(removeNullValues, castToSchema)(filters)

    useEffect(() => {
        if (!hasParsedQuery) return
        if (isEqual(parseQuery(params), filters)) return

        router.push(pathname + "?" + stringify(validateFilters(filters)))
    }, [filters])

    /**
     * Debounced values
     */
    const [debouncedIsReady] = useDebounce(hasParsedQuery, 1000)
    const [debouncedFilters, setDebouncedFilters] = useDebounce(filters, undefined, {
        setInputValue: setFilters,
    })

    return {
        formik,
        filters: debouncedFilters,
        setDebouncedFilters,
        setFilters: flow(setDefaults, setFilters),
        isReady: debouncedIsReady,
    }
}

type SearchProviderProps = {
    children: ReactNode
    search: Parameters<typeof useSearch>
}

export const SearchProvider = (props: SearchProviderProps) => {
    const {children, search} = props
    const value = useSearch(...search)

    return (
        <FormikProvider value={value.formik}>
            <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
        </FormikProvider>
    )
}
