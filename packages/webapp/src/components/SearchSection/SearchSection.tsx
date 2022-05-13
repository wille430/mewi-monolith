import { ListingFilters } from '@/components/ListingFilters/ListingFilters'
import ListingGrid from '@/components/ListingGrid/ListingGrid'
import { Button, Container } from '@mewi/ui'
import { useQuery } from 'react-query'
import queryString from 'query-string'
import { Listing } from '@mewi/prisma'
import { useListingFilters } from '@/hooks/useListingFilters'
import axios from 'axios'
import { ListingSearchFilters } from '@wille430/common'
import PageNav from '../PageNav/PageNav'
import { useRef } from 'react'
import { ListingResultText } from '../ListingResultText/ListingResultText'
import SortButton from '../SortButton/SortButton'

export interface SearchSectionProps {
    defaultFilters?: Partial<ListingSearchFilters>
}

export const SearchSection = () => {
    const { filters, debouncedFilters, setFilters, defaults: defaultFilters } = useListingFilters()
    const scrollUpRef = useRef()

    const { data } = useQuery(
        ['listings', debouncedFilters],
        () =>
            axios
                .get<{ hits: Listing[]; totalHits: number } | undefined>(
                    '/listings?' + queryString.stringify(debouncedFilters)
                )
                .then((res) => res.data),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    )

    return (
        <section className='w-full'>
            <div ref={scrollUpRef} />
            <Container>
                <Container.Content>
                    <div className='grid gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3'>
                        <ListingFilters filters={filters} setFilters={setFilters} />
                    </div>
                </Container.Content>
                <Container.Footer className='flex justify-end'>
                    <Button
                        label='Rensa'
                        onClick={() =>
                            setFilters({
                                ...defaultFilters,
                            })
                        }
                    />
                </Container.Footer>
            </Container>
            <div className='mb-4 flex justify-between py-1'>
                <ListingResultText totalHits={data?.totalHits} />
                <SortButton />
            </div>
            <ListingGrid />
            <PageNav anchorEle={scrollUpRef} totalHits={data?.totalHits} />
        </section>
    )
}
