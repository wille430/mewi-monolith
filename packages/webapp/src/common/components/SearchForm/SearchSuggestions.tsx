import { autocomplete } from "api"
import { HTMLAttributes, useEffect, useState } from "react"
import AutoCompleteRow from "./AutoCompleteRow"

interface Suggestion { text: string, score: number, freq: number }

interface SearchSuggestionsProps extends HTMLAttributes<HTMLDivElement> {
    query: string,
    show?: boolean
}

const SearchSuggestions = ({ query, show = true, ...props }: SearchSuggestionsProps) => {

    const [suggestions, setSuggestions] = useState<Suggestion[]>([])

    useEffect(() => {
        autocomplete(query).then(suggestions => setSuggestions(suggestions))
    }, [query])

    return (
        <div
            className={`absolute w-full ${(show && suggestions.length >= 1) ? 'block' : 'hidden'} border border-gray-400 rounded-xl overflow-hidden z-40 divide-y-2`}
            {...props}
        >
            {suggestions.map((suggestion, i) => <AutoCompleteRow key={i} keyword={suggestion.text}>{suggestion.text}</AutoCompleteRow>)}
        </div>
    )
}

export default SearchSuggestions