import { ListingSearchFilters } from '@/common/types'
import differenceWith from 'lodash/differenceWith'
import toPairs from 'lodash/toPairs'
import flow from 'lodash/flow'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import isFunction from 'lodash/isFunction'
import pick from 'lodash/pick'
import fromPairs from 'lodash/fromPairs'
import Router, { useRouter } from 'next/router'
import { stringify } from 'query-string'
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { ObjectSchema } from 'yup'
import { useDebounce } from './useDebounce'
import { FormikProvider, useFormik } from 'formik'
import noop from 'lodash/noop'

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
    const [hasParsedQuery, setHasParsedQuery] = useState(false)

    const formik = useFormik<T>({
        initialValues: (defaultValue ?? {}) as T,
        onSubmit: noop,
    })
    const { values, setValues } = formik

    /**
     * Debounced values
     */
    const [debouncedIsReady] = useDebounce(hasParsedQuery, 1000)
    const [debouncedFilters, setDebouncedFilters] = useDebounce(values, undefined, {
        setInputValue: setValues,
    })

    const isSame = (obj1: any, obj2: any) => {
        return stringify(obj1) === stringify(obj2)
    }

    const updateQuery = () => {
        router.push(
            {
                query: stringify(values),
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

        setValues({
            ...defaultValue,
            ...(schema.cast(Router.query) as any),
        })

        setHasParsedQuery(true)
    }, [queryParams])

    useEffect(() => {
        if (!hasParsedQuery || isEmpty(values) || isSame(values, router.query)) {
            return
        }

        updateQuery()
    }, [values])

    const oldFilters = useRef(values)

    /**
     * Used in composition with setFilters to set values to defaults
     * when certain fields in filters is changed. E.g. One use case
     * the page value could be set page to 1 every time the keyword
     * changes.
     */
    const setDefaults = (...args: Parameters<typeof setValues>) => {
        const newFilters = isFunction(args[0]) ? args[0](values) : args[0]

        const diff = fromPairs(
            differenceWith(toPairs(newFilters), toPairs(oldFilters.current), isEqual)
        )
        const diffKeys = Object.keys(diff)

        if (!(diffKeys.length === 1 && diffKeys.some((val) => val in (defaultValue ?? {})))) {
            Object.assign(newFilters, defaultValue)
        }
        oldFilters.current = newFilters

        return newFilters
    }

    return {
        formik,
        filters: debouncedFilters,
        setDebouncedFilters,
        setFilters: flow(setDefaults, setValues),
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

    return (
        <FormikProvider value={value.formik}>
            <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
        </FormikProvider>
    )
}
