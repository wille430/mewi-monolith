import { Container } from '@mewi/ui'
import React, { ReactNode } from 'react'
import { ListingFilters, ListingFiltersProps } from '../ListingFilters/ListingFilters'

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
