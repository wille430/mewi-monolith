import { Container } from '@wille430/ui'
import type { ReactNode } from 'react'
import React from 'react'
import type { ListingFiltersProps } from '../ListingFilters/ListingFilters'
import { ListingFilters } from '../ListingFilters/ListingFilters'

type ListingFiltersAreaProps = ListingFiltersProps & {
    footer?: ReactNode
}

const ListingFiltersArea = ({ footer, ...rest }: ListingFiltersAreaProps) => {
    return (
        <Container>
            <Container.Content>
                <div className='grid gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3'>
                    <ListingFilters {...rest} />
                </div>
            </Container.Content>
            <Container.Footer className='flex justify-end space-x-2'>{footer}</Container.Footer>
        </Container>
    )
}

export default ListingFiltersArea
