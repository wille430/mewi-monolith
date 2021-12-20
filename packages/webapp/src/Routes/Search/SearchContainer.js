import { useContext, useEffect, useState } from 'react'
import Search from './index'
import { useLocation } from "react-router-dom"
import { SearchContext } from 'common/context/SearchContext'
import useSearchQuery from 'common/hooks/useSearchQuery'
import { getSearchResults } from 'api'

const SearchContainer = () => {

    const { search, setSearch } = useContext(SearchContext)
    const [loading, setLoading] = useState(false)

    const { searchQuery } = useSearchQuery()

    const searchParams = useLocation().search

    const query = new URLSearchParams(searchParams).get('q')
    const page = search.pageNum

    const getHits = async () => {
        let url = process.env.NX_API_URL + "/search/" + query + `?page=${page}`

        const body = searchQuery

        setLoading(true)

        if (!query) {
            url = process.env.NX_API_URL + `/search?page=${page}`
        }

        // Don't show too old expired auctions
        body.query.bool.must_not = [
            { range: { endDate: { lte: Date.now() - 10 * 60 * 1000 } } }
        ]

        let searchResults = {}
        try {
            searchResults = await getSearchResults(query)
        } catch (e) {
            console.log(e)
        }

        setLoading(false)
        setSearch(prevState => ({
            ...prevState,
            totalHits: searchResults.totalHits || 0,
            hits: searchResults.hits || []
        }))
    }

    useEffect(() => {
        getHits()
        // eslint-disable-next-line
    }, [searchQuery])

    return (
        <Search loading={loading} />
    )
}

export default SearchContainer