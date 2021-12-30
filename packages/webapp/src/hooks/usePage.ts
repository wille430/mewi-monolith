import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'

const usePage = () => {
    const location = useLocation()
    const history = useHistory()

    const getPage = (): number => {
        const page = new URLSearchParams(location.search).get('page')
        return parseInt(page || '1')
    }

    const [page, setPage] = useState<number>(getPage())

    const savePage = (value: number) => {
        console.log({ value })
        setPage(value)
        const searchParams = new URLSearchParams(location.search)
        if (!value) {
            searchParams.delete('page')
        } else {
            searchParams.set('page', value.toString())
        }
        history.replace({
            pathname: location.pathname,
            search: new URLSearchParams(searchParams).toString(),
        })
    }

    useEffect(() => {
        setPage(getPage())
        // eslint-disable-next-line
    }, [location.search])

    return {
        page,
        setPage: savePage,
    }
}

export default usePage
