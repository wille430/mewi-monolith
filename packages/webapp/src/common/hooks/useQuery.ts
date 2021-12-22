import { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'

const useQuery = () => {
    const history = useHistory()
    const location = useLocation()

    const getQuery = () => {
        let filterQuery = new URLSearchParams(location.search)
        return filterQuery
    }

    const [query, setQuery] = useState<URLSearchParams>(getQuery())

    useEffect(() => {
        setQuery(getQuery())
        // eslint-disable-next-line
    }, [location.search])

    const saveQuery = (newParams: { [key: string]: string | undefined }): void => {
        const searchParams = getQuery()

        Object.keys(newParams).forEach((key) => {
            const value = newParams[key]
            console.log({ key, value })
            if (!value || value === '' || value === 'null') {
                searchParams.delete(key)
            } else {
                searchParams.set(key, value)
            }
        })

        setQuery(searchParams)

        history.replace({
            pathname: location.pathname,
            search: new URLSearchParams(searchParams).toString(),
        })
    }

    return {
        query,
        setQuery: saveQuery,
    }
}

export default useQuery
