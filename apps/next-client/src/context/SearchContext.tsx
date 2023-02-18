import differenceWith from 'lodash/differenceWith'
import toPairs from 'lodash/toPairs'
import flow from 'lodash/flow'
import isEqual from 'lodash/isEqual'
import isFunction from 'lodash/isFunction'
import fromPairs from 'lodash/fromPairs'
import {useRouter} from 'next/router'
import {stringify} from 'query-string'
import {createContext, ReactNode, useContext, useEffect, useState} from 'react'
import {ObjectSchema} from 'yup'
import {useDebounce} from '@/hooks/useDebounce'
import {FormikProvider, useFormik} from 'formik'
import noop from 'lodash/noop'
import {ParsedUrlQuery} from "querystring"

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
    const [hasParsedQuery, setHasParsedQuery] = useState(false)

    const formik = useFormik<T>({
        initialValues: (defaultValue ?? {}) as T,
        onSubmit: noop,
    })
    const {values: filters, setValues: setFilters} = formik

    // Get filters from query
    useEffect(() => {
        setFilters(parseQuery(router.query))
        setHasParsedQuery(true)
    }, [router.query])

    const parseQuery = (urlQuery: ParsedUrlQuery): T => {
        return setDefaults(schema.cast(urlQuery))
    }

    useEffect(() => {
        if (!hasParsedQuery) return

        if (isEqual(parseQuery(router.query), filters)) {
            return
        }

        (async () => {
            await router.push(
                {
                    query: stringify(filters),
                },
                undefined,
                {
                    shallow: true,
                }
            )
        })()

    }, [filters])

    /**
     * Debounced values
     */
    const [debouncedIsReady] = useDebounce(hasParsedQuery, 1000)
    const [debouncedFilters, setDebouncedFilters] = useDebounce(filters, undefined, {
        setInputValue: setFilters,
    })

    /**
     * Used in composition with setFilters to set values to defaults
     * when certain fields in filters is changed. E.g. One use case
     * the page value could be set page to 1 every time the keyword
     * changes.
     */
    const setDefaults = (...args: Parameters<typeof setFilters>) => {
        const newFilters = isFunction(args[0]) ? args[0](filters) : args[0]

        const diff = fromPairs(
            differenceWith(toPairs(newFilters), toPairs(filters), isEqual)
        )
        const diffKeys = Object.keys(diff)

        if (!(diffKeys.length === 1 && diffKeys.some((val) => val in (defaultValue ?? {})))) {
            Object.assign(newFilters, defaultValue)
        }

        return newFilters
    }

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
