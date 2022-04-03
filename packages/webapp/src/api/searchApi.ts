import axios from 'axios'
import { SearchState } from 'store/search/type'
import { IListing } from '@mewi/common/types'

export type getSearchResultsReturnType = {
    hits: IListing[]
    totalHits: SearchState['totalHits']
}

const getSearchResults = async (options?): Promise<getSearchResultsReturnType> => {
    const { hits, totalHits } = await axios
        .post('/search', {
            ...options,
        })
        .then((res) => res.data)

    return { hits, totalHits } as getSearchResultsReturnType
}

const autocomplete = async (keyword: string) => {
    if (keyword === '') return []
    const suggestions =
        (await axios.get('/listings/autocomplete/' + keyword).then((res) => res.data)) || []
    return suggestions
}
const getItemById = async (itemId: string) => {
    const item: IListing | undefined = await axios.get('/items/' + itemId).then((res) => res.data)
    return item
}

export default {
    getSearchResults,
    autocomplete,
    getItemById,
}
