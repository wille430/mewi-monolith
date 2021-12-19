import { useState, createRef, useEffect } from 'react';
import SearchSuggestions from './SearchSuggestions';
import SearchButton from './SearchButton'

export interface SearchFormProps {
    size?: "large" | "small",
    showSearchIcon?: boolean
}

const SearchForm = ({ size = "large", showSearchIcon = true }: SearchFormProps) => {

    const [state, setState] = useState({
        showAutoComplete: false,
        blur: false,
    })

    const [query, setQuery] = useState("")

    const formRef = createRef<HTMLFormElement>()
    const searchButtonRef = createRef<HTMLButtonElement>()

    const handleInputChange = (e: any) => {
        setQuery(e.target?.value || "")
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
                setState(prevState => ({
                    ...prevState,
                    showAutoComplete: false,
                    blur: false,
                }))
            }
        }
        waitAndHideAutoComplete()
    }, [state.blur])

    return (
        <form ref={formRef} className={`relative w-full ${size === "small" && 'max-w-2xl'}`}>
            <div className={`outline-none flex flex-row relative ${size === "small" ? "h-8" : "h-12"}`}>
                <input
                    className="absoluteh-full w-full outline-none rounded-xl pl-4 pr-12 border border-black"
                    placeholder="Sök efter en vara..."
                    onKeyDown={e => e.keyCode === 13 && searchButtonRef.current?.click()}
                    onChange={handleInputChange}
                    name="q"
                    value={query}
                    autoComplete="off"
                    onFocus={e => setState(prevState => ({
                        ...prevState,
                        showAutoComplete: true,
                        blur: false,
                    }))}
                    onBlur={e => setState(prevState => ({
                        ...prevState,
                        blur: true
                    }))}
                    data-testid="searchInput"
                />
                {
                    showSearchIcon &&
                    <SearchButton
                        ref={searchButtonRef}
                        query={query}
                        data-testid="searchButton"
                    />
                }
            </div>
            <SearchSuggestions
                query={query}
                show={state.showAutoComplete}
                data-testid="searchSuggestions"
            />
        </form>
    );
}

export default SearchForm;