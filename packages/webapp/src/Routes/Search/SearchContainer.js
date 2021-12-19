import { useContext, useEffect, useState } from 'react'
import Search from './index'
import { useLocation } from "react-router-dom"
import { SearchContext } from 'common/context/SearchContext'
import fetchWithTimeout from 'utils/fetchWithTimeout'
import useSearchQuery from 'common/hooks/useSearchQuery'

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

        let response = {}
        try {
            response = await fetchWithTimeout(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(res => res.json())
        } catch (e) {
            console.log(e)
        }

        setLoading(false)
        setSearch(prevState => ({
            ...prevState,
            totalHits: response.totalHits || 0,
            hits: response.hits || []
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