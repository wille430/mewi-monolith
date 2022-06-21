import { ListingSearchFilters } from '@wille430/common'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@wille430/ui'
import PageNav from '../PageNav/PageNav'
import { ListingResultText } from '../ListingResultText/ListingResultText'
import SortButton from '../SortButton/SortButton'
import { ListingPopUpContainer } from '../ListingPopUp/ListingPopUp'
import ListingFiltersArea from '../ListingFiltersArea/ListingFiltersArea'
import { CreateWatcherButton } from '../CreateWatcherButton/CreateWatcherButton'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { searchListings } from '@/store/listings'
import { useListingFilters } from '@/hooks/useListingFilters'
import ListingGrid from '@/components/ListingGrid/ListingGrid'

export interface SearchSectionProps {
    defaultFilters?: Partial<ListingSearchFilters>
}

export const SearchSection = () => {
    const { filters, debouncedFilters, setFilters, defaults: defaultFilters } = useListingFilters()
    const scrollUpRef = useRef<HTMLDivElement | null>(null)

    const [error, setError] = useState('')

    const search = useAppSelector((state) => state.listings.search)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(searchListings(debouncedFilters))
    }, [debouncedFilters])

    return (
        <section className='w-full h-full flex flex-col'>
            <div ref={scrollUpRef} />
            <ListingFiltersArea
                {...{
                    filters,
                    setFilters,
                    defaultFilters,
                    footer: (
                        <>
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
                        </>
                    ),
                }}
            />
            <div className='my-4 flex justify-between'>
                <ListingResultText totalHits={search.totalHits} />
                <SortButton />
            </div>
            <ListingGrid />
            <PageNav anchorEle={scrollUpRef} totalHits={search.totalHits} />
            <ListingPopUpContainer />
        </section>
    )
}
