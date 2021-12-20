import axios from "axios"

export const getSearchResults = async (keyword: string, page?: string) => {

    let urlPath = '/search/' + keyword
    if (page) {
        urlPath += '?page=' + page
    }

    const searchResult = await axios.get(urlPath).then(res => res.data)
    return searchResult
}
export const autocomplete = async (keyword: string) => {
    if (keyword === "") return []
    const suggestions = await axios.get('/search/suggest/' + keyword).then(res => res.data) || []
    console.log(suggestions)
    return suggestions
}