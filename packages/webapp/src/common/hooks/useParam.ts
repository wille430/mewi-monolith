import { useState, useEffect } from "react"
import { useHistory, useLocation } from "react-router"

const useParam = (name: string) => {
    const history = useHistory()
    const location = useLocation()

    const getParam = (): string => {
        let filterQuery: string | null = new URLSearchParams(location.search).get(name)
        return filterQuery || ''
    }

    const [param, setParam] = useState<string>(getParam())

    useEffect(() => {
        setParam(getParam())
        // eslint-disable-next-line
    }, [location.search])

    const saveParam = (value: any): void => {
        setParam(value)
        const searchParams = new URLSearchParams(location.search)
        if (!value || value === '' || value === 'null' || (Array.isArray(value) && value.length <= 0)) {
            searchParams.delete(name)
        } else {
            searchParams.set(name, value)
        }
        history.replace({
            pathname: location.pathname,
            search: new URLSearchParams(searchParams).toString()
        })
    }

    const returnValue: [string, (val: any) => void] = [param, saveParam]

    return returnValue
}

export default useParam