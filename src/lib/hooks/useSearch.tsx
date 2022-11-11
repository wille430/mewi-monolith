import { useRouter } from 'next/router'
import { stringify } from 'query-string'
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { ObjectSchema } from 'yup'
import { searchListingsSchema } from '../client/listings/schemas/search-listings.schema'

export type UseSearchOptions<T = Record<string, never>> = {
    exclude?: Partial<T>
    defaultValue?: Partial<T>
}

const SearchContext = createContext<any>(null)

export const useSearchContext = <T,>(): ReturnType<typeof useSearch<T>> => useContext(SearchContext)

export const useSearch = <T,>(
    schema: ObjectSchema<any, any>,
    options: UseSearchOptions<T> = {}
) => {
    const { defaultValue } = options
    const router = useRouter()
    const [filters, setFilters] = useState<T>({} as T)
    const hasParsedQuery = useRef(true)

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
        if (!isSame(filters, router.query)) {
            router.push(
                {
                    query: stringify(filters as any),
                },
                undefined,
                {
                    shallow: true,
                }
            )
        }
    }

    useEffect(() => {
        if (!isSame(filters, router.query)) {
            setFilters({
                ...(searchListingsSchema.cast(filters) as any),
                ...defaultValue,
            })
        }

        if (hasParsedQuery.current) {
            updateQuery()
        }

        hasParsedQuery.current = true
    }, [])

    useEffect(() => {
        if (!hasParsedQuery.current) {
            return
        }

        updateQuery()
    }, [filters])

    return {
        filters,
        setFilters,
        setField,
        clear,
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
