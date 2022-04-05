import { useAppDispatch } from 'hooks/hooks'
import { ReactNode } from 'react'
import { setFilters } from 'store/search/creators'

interface AutoCompleteRowProps {
    children: ReactNode | string
    keyword: string
    onClick?: (newVal: string) => void
}

const AutoCompleteRow = ({ children, keyword, onClick }: AutoCompleteRowProps) => {
    const dispatch = useAppDispatch()

    const handleClick = () => {
        dispatch(setFilters({ keyword }))
        onClick && onClick(keyword)
    }

    return (
        <li
            onClick={handleClick}
            className='z-50 block w-full cursor-pointer px-4 py-1.5 text-left hover:bg-gray-300 truncate'
        >
            {children}
        </li>
    )
}

export default AutoCompleteRow
