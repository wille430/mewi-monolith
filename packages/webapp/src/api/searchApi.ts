import { SearchPostRequestBody } from '@mewi/types'
import axios from 'axios'
import { SearchState } from 'store/search/type'

const getSearchResults = async (
    options?: SearchPostRequestBody
): Promise<Pick<SearchState, 'hits' | 'totalHits'>> => {
    const { hits, totalHits } = await axios
        .post(process.env.NX_API_URL + '/search', {
            ...options,
        })
        .then((res) => res.data)
    return { hits, totalHits }
}

const autocomplete = async (keyword: string) => {
    if (keyword === '') return []
    const suggestions =
        (await axios.get('/search/suggest/' + keyword).then((res) => res.data)) || []
    console.log(suggestions)
    return suggestions
}

export default {
    getSearchResults,
    autocomplete,
}
