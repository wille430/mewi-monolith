import { useState } from 'react'
import SearchSuggestions from './SearchSuggestions/SearchSuggestions'
import SearchButton from './SearchButton'
import { useHistory } from 'react-router-dom'
import queryString from 'query-string'
import { useAppDispatch } from 'hooks/hooks'
import { setFilters } from 'store/search/creators'
import * as styles from './SearchForm.module.scss'
import classNames from 'classnames'

export interface SearchFormProps {
    showSearchIcon?: boolean
}

const SearchForm = ({ showSearchIcon = true }: SearchFormProps) => {
    const history = useHistory()
    const [keyword, setKeyword] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const dispatch = useAppDispatch()

    const handleInputChange = (e: any) => {
        setKeyword(e.target?.value)
    }

    const handleSubmit = (_keyword?: string) => {
        if (history.location.pathname === '/search') {
            dispatch(setFilters({ keyword: _keyword ?? keyword }))
        } else {
            history.push({
                pathname: '/search',
                search: queryString.stringify({ keyword: _keyword ?? keyword }),
            })
        }
    }

    return (
        <>
            <div
                className={classNames({
                    [styles.hideOverlay]: true,
                    ['hidden']: !showSuggestions,
                })}
                onClick={() => setShowSuggestions(false)}
            />
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
                        autoComplete='off'
                        data-testid='searchInput'
                    />
                    {showSearchIcon && <SearchButton />}
                </div>
                <SearchSuggestions
                    query={keyword}
                    show={showSuggestions}
                    onAutoCompleteClick={(newKeyword) => {
                        setKeyword(newKeyword)
                        setShowSuggestions(false)
                        setTimeout(() => {
                            handleSubmit && handleSubmit(newKeyword)
                        }, 500)
                    }}
                    data-testid='searchSuggestions'
                />
            </form>
        </>
    )
}

export default SearchForm
