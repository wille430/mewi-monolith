import axios from "axios"

export const search = async () => {
    // to-do
}
export const autocomplete = async (keyword: string) => {
    if (keyword === "") return []
    const suggestions = await axios.get('/search/suggest/' + keyword).then(res => res.data) || []
    console.log(suggestions)
    return suggestions
}