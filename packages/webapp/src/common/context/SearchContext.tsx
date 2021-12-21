import { createContext, ReactNode, useEffect, useState } from "react"
import React from "react"
import { SearchState } from 'models/types'
import { SearchFilterDataProps } from "@mewi/types"
import { getSearchResults } from "api"
import { useLocation } from "react-router"
import { SearchParamsUtils } from "utils"

const initialState: SearchState = {
    searchId: '',
    totalHits: 0,
    hits: []
}

interface Props {
    children: ReactNode
}

interface SearchContextProps {
    search: SearchState,
    filters: SearchFilterDataProps,
    setFilters: Function,
    isLoading: boolean
}

export const SearchContext = createContext<SearchContextProps>({
    search: initialState,
    filters: {},
    setFilters: () => { },
    isLoading: false
})

export const SearchProvider = ({ children }: Props) => {

    const [search, setSearch] = useState(initialState)
    const [isLoading, setIsLoading] = useState(false)
    const [filters, setFilters] = useState<SearchFilterDataProps>({})

    const location = useLocation()
    const page: number = parseInt(new URLSearchParams(location.search).get('page') || '1')

    useEffect(() => {
        console.log('Getting initial search filters from parameters...')
        const urlSearchParams = new URLSearchParams(location.search)
        const newSearchFilters = SearchParamsUtils.searchParamsToObj(urlSearchParams)
        console.log('Search filters from params: ', newSearchFilters)
        setFilters(newSearchFilters)
    }, [])

    useEffect(() => {
        console.log('Searching with filters: ', filters)
        setIsLoading(true)
        getSearchResults({
            searchFilters: filters,
            page: page,
        })
            .then(results => {
                setSearch(results)
                setIsLoading(false)
            })
            .catch(e => {
                setIsLoading(false)
            })
    }, [filters, page])

    return (
        <SearchContext.Provider value={{
            search,
            filters,
            setFilters,
            isLoading
        }}>
            {children}
        </SearchContext.Provider>
    )
}