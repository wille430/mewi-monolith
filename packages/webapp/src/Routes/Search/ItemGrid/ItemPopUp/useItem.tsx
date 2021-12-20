import useParam from "common/hooks/useParam"
import { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router"
import fetchWithTimeout from "utils/fetchWithTimeout"

interface ItemStateProps {
    body?: string,
    category?: string[],
    date?: number,
    imageUrl?: string[],
    origin?: string,
    parameters?: any,
    price?: {
        value?: number,
        currency?: string
    },
    redirectUrl?: string,
    region?: string,
    title?: string
}

const searchParam = 'selectedItem'

const useItem = () => {

    const location = useLocation()
    const history = useHistory()
    const [ param, ] = useParam(searchParam)

    const [item, setItem] = useState<ItemStateProps | null>()

    const getItem = async () => {
        const itemId = param
        if (!itemId) return

        const url = process.env.NX_API_URL + "/items/id/" + itemId
        try {
            const response = await fetchWithTimeout(url).then(res => res.json())
            setItem(response.body._source)
        } catch (e) {
            console.log(e)
            setItem(null)
        }
    }

    const saveItem = async (itemId: string | null) => {
        const searchParams = new URLSearchParams(location.search)
        if (itemId) {
            searchParams.set(searchParam, itemId)
        } else {
            searchParams.delete(searchParam)
        }
        history.replace({
            pathname: location.pathname,
            search: new URLSearchParams(searchParams).toString()
        })
    }

    useEffect(() => {
        getItem()
        // eslint-disable-next-line
    }, [param])

    return {
        item,
        setItem: saveItem
    }
}

export default useItem