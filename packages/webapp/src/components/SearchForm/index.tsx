import { useState } from 'react'
import SearchSuggestions from './SearchSuggestions'
import SearchButton from './SearchButton'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { setFilters } from 'store/search/creators'
import queryString from 'query-string'

export interface SearchFormProps {
    showSearchIcon?: boolean
}

const SearchForm = ({ showSearchIcon = true }: SearchFormProps) => {
    const dispatch = useDispatch()

    const history = useHistory()
    const [keyword, setKeyword] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)

    const handleInputChange = (e: any) => {
        setKeyword(e.target?.value)
    }

    const handleSubmit = () => {
        history.push({
            pathname: '/search',
            search: queryString.stringify({ keyword }),
        })
        dispatch(setFilters({ keyword }))
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
            }}
            className='relative h-12 w-full'
        >
            <div className='flex h-full flex-row outline-none'>
                <input
                    className='w-full rounded-xl border border-black pl-4 pr-12 text-black outline-none'
                    placeholder='Sök efter en vara...'
                    onKeyDown={(e) => e.keyCode === 13 && handleSubmit()}
                    onChange={handleInputChange}
                    value={keyword}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setShowSuggestions(false)}
                    autoComplete='off'
                    data-testid='searchInput'
                />
                {showSearchIcon && <SearchButton />}
            </div>
            <SearchSuggestions
                query={keyword}
                show={showSuggestions}
                onAutoCompleteClick={(newKeyword) => {
                    setTimeout(() => {
                        handleSubmit && handleSubmit()
                    }, 500)

                    setKeyword(newKeyword)
                }}
                data-testid='searchSuggestions'
            />
        </form>
    )
}

export default SearchForm
