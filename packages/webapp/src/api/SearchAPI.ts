
const { NX_API_URL } = process.env

const SearchAPI = {
    search: async () => {
        // to-do
    },
    autocomplete: async (keyword: string) => {
        if (keyword === "") return []

        const url = NX_API_URL + "/search/suggest/" + keyword
        
        const response = await fetch(url, {
            method: "GET"
        }).then(res => res.json())

        return response
    }
}

export default SearchAPI