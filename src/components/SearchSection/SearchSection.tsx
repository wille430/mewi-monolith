import { useEffect, useRef } from 'react'
import isEqual from 'lodash/isEqual'
import PageNav from '../PageNav/PageNav'
import { ListingResultText } from '../ListingResultText/ListingResultText'
import SortButton from '../SortButton/SortButton'
import { ListingPopUpContainer } from '../ListingPopUp/ListingPopUpContainer'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { searchListings } from '@/store/listings'
import { useListingFilters } from '@/hooks/useListingFilters'
import ListingGrid from '@/components/ListingGrid/ListingGrid'
import { ListingSearchFilters } from '@/common/types'

export interface SearchSectionProps {
    defaultFilters?: Partial<ListingSearchFilters>
}

export const SearchSection = () => {
    const lastFilters = useRef({})
    const { debouncedFilters } = useListingFilters()
    const scrollUpRef = useRef<HTMLDivElement | null>(null)

    const search = useAppSelector((state) => state.listings.search)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isEqual(lastFilters.current, debouncedFilters)) {
            lastFilters.current = debouncedFilters
            dispatch(searchListings(debouncedFilters))
        }
    }, [debouncedFilters])

    return (
        <section className='flex h-full w-full flex-col'>
            <div ref={scrollUpRef} />
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
