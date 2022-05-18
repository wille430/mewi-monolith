import { Button, Container } from '@mewi/ui'
import { useQuery } from 'react-query'
import queryString from 'query-string'
import { Listing } from '@mewi/prisma'
import axios from 'axios'
import { ListingSearchFilters } from '@wille430/common'
import { useRef, useState } from 'react'
import PageNav from '../PageNav/PageNav'
import { ListingResultText } from '../ListingResultText/ListingResultText'
import SortButton from '../SortButton/SortButton'
import ListingPopUp from '../ListingPopUp/ListingPopUp'
import { CreateWatcherButton } from '../CreateWatcherButton/CreateWatcherButton'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { closeListing } from '@/store/listings'
import { useListingFilters } from '@/hooks/useListingFilters'
import ListingGrid from '@/components/ListingGrid/ListingGrid'
import { ListingFilters } from '@/components/ListingFilters/ListingFilters'

export interface SearchSectionProps {
    defaultFilters?: Partial<ListingSearchFilters>
}

export const SearchSection = () => {
    const { filters, debouncedFilters, setFilters, defaults: defaultFilters } = useListingFilters()
    const scrollUpRef = useRef()
    const openedListing = useAppSelector((state) => state.listings.opened)
    const dispatch = useAppDispatch()
    const [error, setError] = useState('')

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
        <section className='w-full h-full flex flex-col'>
            <div ref={scrollUpRef} />
            <Container>
                <Container.Content>
                    <div className='grid gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3'>
                        <ListingFilters filters={filters} setFilters={setFilters} />
                    </div>
                </Container.Content>
                <Container.Footer className='flex justify-end space-x-2'>
                    <span className='text-red-400'>{error}</span>
                    <CreateWatcherButton
                        label='Bevaka sökning'
                        variant='outlined'
                        filters={filters}
                        setError={setError}
                        onSuccess={() => setError('')}
                    />
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
            <div className='my-4 flex justify-between'>
                <ListingResultText totalHits={data?.totalHits} />
                <SortButton />
            </div>
            <ListingGrid />
            <PageNav anchorEle={scrollUpRef} totalHits={data?.totalHits} />
            {openedListing && (
                <ListingPopUp
                    onClose={() => dispatch(closeListing())}
                    listing={openedListing}
                ></ListingPopUp>
            )}
        </section>
    )
}
