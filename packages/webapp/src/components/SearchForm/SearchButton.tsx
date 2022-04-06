import { FiSearch } from 'react-icons/fi'

const SearchButton = () => {
    return (
        <button
            className='absolute right-0 top-0 bottom-0 pr-4'
            type='submit'
            data-testid='searchButton'
        >
            <FiSearch size='20' />
        </button>
    )
}

export default SearchButton
