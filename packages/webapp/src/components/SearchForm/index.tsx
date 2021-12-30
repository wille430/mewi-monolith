import { useState, useEffect } from 'react'
import SearchSuggestions from './SearchSuggestions'
import SearchButton from './SearchButton'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { getSearchResults, setFilters } from 'store/search/creators'
import queryString from 'query-string'

export interface SearchFormProps {
    size?: 'large' | 'small'
    showSearchIcon?: boolean
}

const SearchForm = ({ size = 'large', showSearchIcon = true }: SearchFormProps) => {
    const [state, setState] = useState({
        showAutoComplete: false,
        blur: false,
    })

    const dispatch = useDispatch()

    const history = useHistory()
    const [keyword, setKeyword] = useState('')

    const handleInputChange = (e: any) => {
        setKeyword(e.target?.value)
    }

    // Wait a certain amount of time before closing the auto complete window
    useEffect(() => {
        const waitAndHideAutoComplete = async () => {
            if (state.blur === true) {
                await new Promise((resolve, reject) => {
                    setInterval(() => {
                        resolve(0)
                    }, 250)
                })
                setState((prevState) => ({
                    ...prevState,
                    showAutoComplete: false,
                    blur: false,
                }))
            }
        }
        waitAndHideAutoComplete()
    }, [state.blur])

    const handleSubmit = () => {
        history.push({
            pathname: 'search',
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
            className={`relative w-full ${size === 'small' && 'max-w-2xl'}`}
        >
            <div
                className={`outline-none flex flex-row relative ${
                    size === 'small' ? 'h-8' : 'h-12'
                }`}
            >
                <input
                    className='absoluteh-full w-full outline-none rounded-xl pl-4 pr-12 border border-black'
                    placeholder='Sök efter en vara...'
                    onKeyDown={(e) => e.keyCode === 13 && handleSubmit()}
                    onChange={handleInputChange}
                    value={keyword}
                    autoComplete='off'
                    onFocus={(e) =>
                        setState((prevState) => ({
                            ...prevState,
                            showAutoComplete: true,
                            blur: false,
                        }))
                    }
                    onBlur={(e) =>
                        setState((prevState) => ({
                            ...prevState,
                            blur: true,
                        }))
                    }
                    data-testid='searchInput'
                />
                {showSearchIcon && <SearchButton />}
            </div>
            <SearchSuggestions
                query={keyword}
                show={state.showAutoComplete}
                onAutoCompleteClick={(newKeyword) => {
                    setKeyword(newKeyword)
                }}
                data-testid='searchSuggestions'
            />
        </form>
    )
}

export default SearchForm
