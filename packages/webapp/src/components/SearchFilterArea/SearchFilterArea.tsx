import { Container } from '@mewi/ui'
import { ReactNode } from 'react'
import SearchFilterContent, { SearchFilterContentProps } from './SearchFilterContent'

export interface SearchFilterAreaProps extends SearchFilterContentProps {
    children?: ReactNode
}

const SearchFilterArea = ({ children, className, ...rest }: SearchFilterAreaProps) => {
    return (
        <Container data-testid='searchFilters' className={className}>
            <SearchFilterContent {...rest} />
            {children}
        </Container>
    )
}

export default SearchFilterArea
