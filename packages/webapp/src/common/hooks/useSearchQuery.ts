import { SearchParamsUtils } from "utils"
import { useLocation } from "react-router"
import { useEffect, useState } from "react"

const useSearchQuery = () => {
    const location = useLocation()

    const [lastSearchParams, setLastSearchParams] = useState(SearchParamsUtils.searchParamsToObj(new URLSearchParams(location.search)))

    const getSearchQuery = () => {
        return SearchParamsUtils.searchToElasticQuery(location.search)
    }

    const searchParamsChanged = (): boolean => {
        const newSearchParams = SearchParamsUtils.searchParamsToObj(new URLSearchParams(location.search))
        console.log({ newSearchParams, lastSearchParams })
        const changed = newSearchParams !== lastSearchParams

        setLastSearchParams(newSearchParams)

        return changed
    }

    const [searchQuery, setSearchQuery] = useState(getSearchQuery())

    useEffect(() => {
        if (searchParamsChanged()) {
            setSearchQuery(getSearchQuery())
        }
        // eslint-disable-next-line
    }, [location.search])

    return {
        searchQuery: searchQuery
    }
}

export default useSearchQuery