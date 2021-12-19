import { createContext, ReactNode, useState } from "react"
import React from "react"
import { SearchState } from 'models/types'

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
    setSearch: React.Dispatch<React.SetStateAction<SearchState>>
}

export const SearchContext = createContext<SearchContextProps>({
    search: initialState,
    setSearch: () => {}
})

export const SearchProvider = ({ children }: Props) => {

    const [search, setSearch] = useState(initialState)

    return <SearchContext.Provider value={{ search, setSearch }}>{children}</SearchContext.Provider>
}