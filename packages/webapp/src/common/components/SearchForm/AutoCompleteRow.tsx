import { SearchContext } from 'common/context/SearchContext'
import { ReactNode, useContext } from 'react'
import { Link } from 'react-router-dom'

interface AutoCompleteRowProps {
    children: ReactNode | string
    keyword: string
    onClick?: (newVal: string) => void
}

const AutoCompleteRow = ({ children, keyword, onClick }: AutoCompleteRowProps) => {
    const { filters, setFilters } = useContext(SearchContext)

    const handleClick = () => {
        setFilters({
            ...filters,
            keyword: keyword,
        })
        onClick && onClick(keyword)
    }

    return (
        <button
            onClick={handleClick}
            className='block w-full bg-white z-50 px-4 py-1.5 hover:bg-gray-300 cursor-pointer text-left'
        >
            {children}
        </button>
    )
}

export default AutoCompleteRow
