import { SearchPostRequestBody } from '@mewi/types'
import axios from "axios"

export const getSearchResults = async (options?: SearchPostRequestBody) => {
    const searchResult = await axios.post(process.env.NX_API_URL + '/search', {
        ...options
    })
        .then(res => res.data)
    return searchResult

}

export const autocomplete = async (keyword: string) => {
    if (keyword === "") return []
    const suggestions = await axios.get('/search/suggest/' + keyword).then(res => res.data) || []
    console.log(suggestions)
    return suggestions
}