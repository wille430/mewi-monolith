
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'

export interface SearchButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    query: string
}

const SearchButton = forwardRef<HTMLButtonElement, SearchButtonProps>((props, ref) => {

    const history = useHistory()
    const { query } = props

    const handleSearch = () => {
        // Create url string with path + search params
        const url = "/search?q=" + query

        // Update url with new filter params
        history.push(url)
    }

    return (
        <button
            className="absolute right-0 top-0 bottom-0 pr-4"
            type={"submit"}
            onClick={handleSearch}
            ref={ref}
            {...props}
        >
            <FiSearch size="20" />
        </button>
    )
})

export default SearchButton