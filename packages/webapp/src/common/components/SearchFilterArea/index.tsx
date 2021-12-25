import { useWindowWidth } from '@react-hook/window-size'
import { ReactNode, useEffect, useState } from 'react'
import { FiArrowDown, FiArrowUp } from 'react-icons/fi'
import Container from '../Container'
import SearchFilterContent, { SearchFilterContentProps } from './SearchFilterContent'

export interface SearchFilterAreaProps extends SearchFilterContentProps {
    children?: ReactNode
    isCollapsable?: boolean
}

const SearchFilterArea = ({ children, isCollapsable, ...rest }: SearchFilterAreaProps) => {
    const [hidden, setHidden] = useState(false)
    const windowWidth = useWindowWidth()

    useEffect(() => {
        if (windowWidth > 640) {
            setHidden(false)
        }
    }, [windowWidth])

    return (
        <Container data-testid='searchFilters'>
            <div className='block sm:hidden'>
                {isCollapsable &&
                    (hidden ? (
                        <FiArrowUp onClick={(e) => setHidden(false)} />
                    ) : (
                        <FiArrowDown onClick={(e) => setHidden(true)} />
                    ))}
            </div>
            <SearchFilterContent {...rest} collapse={hidden} />
            {children}
        </Container>
    )
}

export default SearchFilterArea
