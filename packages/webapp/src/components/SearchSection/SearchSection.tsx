import { ListingFilters } from '@/components/ListingFilters/ListingFilters'
import ListingGrid from '@/components/ListingGrid/ListingGrid'
import { Container } from '@mewi/ui'
import { useQuery } from 'react-query'
import queryString from 'query-string'
import { Listing } from '@mewi/prisma'
import { useListingFilters } from '@/hooks/useListingFilters'
import axios from 'axios'
import { ListingSearchFilters } from '@wille430/common'

export interface SearchSectionProps {
    defaultFilters?: Partial<ListingSearchFilters>
}

export const SearchSection = ({ defaultFilters = {} }: SearchSectionProps) => {
    const { filters, debouncedFilters, setFilters } = useListingFilters(
        defaultFilters,
        Object.keys(defaultFilters) as Array<keyof ListingSearchFilters>
    )

    const { data: listings } = useQuery(
        ['listings', debouncedFilters],
        () =>
            axios
                .get<{ hits: Listing[] }>('/listings?' + queryString.stringify(debouncedFilters))
                .then((res) => res.data?.hits),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    )

    return (
        <section className='max-w-4xl mx-auto'>
            <Container className='mb-12'>
                <ListingFilters filters={filters} setFilters={setFilters} />
            </Container>
            <ListingGrid listings={listings} />
        </section>
    )
}
