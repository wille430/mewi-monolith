import { ItemData, SearchPostRequestBody } from '@mewi/types'
import axios from 'axios'
import { SearchState } from 'store/search/type'

const getSearchResults = async (
    options?: SearchPostRequestBody
): Promise<Pick<SearchState, 'hits' | 'totalHits'>> => {
    const { hits, totalHits } = await axios
        .post('/search', {
            ...options,
        })
        .then((res) => res.data)
    return { hits, totalHits }
}

const autocomplete = async (keyword: string) => {
    if (keyword === '') return []
    const suggestions =
        (await axios.get('/search/suggest/' + keyword).then((res) => res.data)) || []
    return suggestions
}
const getItemById = async (itemId: string) => {
    const item: ItemData = await axios.get('/items/' + itemId).then(res => res.data.body._source)
    return item
}

export default {
    getSearchResults,
    autocomplete,
    getItemById
}
