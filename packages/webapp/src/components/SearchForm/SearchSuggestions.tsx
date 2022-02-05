import searchApi from 'api/searchApi'
import _ from 'lodash'
import { HTMLAttributes, useCallback, useEffect, useState } from 'react'
import AutoCompleteRow from './AutoCompleteRow'

interface Suggestion {
    text: string
    score: number
    freq: number
}

interface SearchSuggestionsProps extends HTMLAttributes<HTMLDivElement> {
    query?: string
    show?: boolean
    onAutoCompleteClick?: (newVal: string) => void
}

const SearchSuggestions = ({
    query,
    show = true,
    onAutoCompleteClick,
    ...props
}: SearchSuggestionsProps) => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])

    const getSuggestions = useCallback(
        _.debounce(() => {
            if (!query) return
            searchApi.autocomplete(query).then((suggestions) => {
                console.log(suggestions)
                setSuggestions(suggestions)
            })
        }, 1000),
        []
    )

    useEffect(() => {
        getSuggestions()
    }, [query])

    return (
        <div
            className={`absolute w-full ${
                show && suggestions.length >= 1 ? 'block' : 'hidden'
            } z-40 divide-y-2 overflow-hidden rounded-xl border border-gray-400`}
            {...props}
        >
            {suggestions.map((suggestion, i) => (
                <AutoCompleteRow
                    key={i}
                    keyword={suggestion.text}
                    onClick={() => onAutoCompleteClick && onAutoCompleteClick(suggestion.text)}
                >
                    {suggestion.text}
                </AutoCompleteRow>
            ))}
        </div>
    )
}

export default SearchSuggestions
