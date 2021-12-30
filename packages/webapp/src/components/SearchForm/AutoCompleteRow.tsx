import { ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { setFilters } from 'store/search/creators'

interface AutoCompleteRowProps {
    children: ReactNode | string
    keyword: string
    onClick?: (newVal: string) => void
}

const AutoCompleteRow = ({ children, keyword, onClick }: AutoCompleteRowProps) => {
    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(setFilters({ keyword }))
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
