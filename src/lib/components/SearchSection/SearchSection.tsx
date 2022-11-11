import { useRef } from 'react'
import PageNav from '../PageNav/PageNav'
import { ListingResultText } from '../ListingResultText/ListingResultText'
import SortButton from '../SortButton/SortButton'
import { ListingPopUpContainer } from '../ListingPopUp/ListingPopUpContainer'
import ListingGrid from '@/lib/components/ListingGrid/ListingGrid'
import { ListingSearchFilters } from '@/common/types'
import { useListingsSearch } from '@/lib/hooks/useListingsResult'

export interface SearchSectionProps {
    defaultFilters?: Partial<ListingSearchFilters>
}

export const SearchSection = () => {
    const scrollUpRef = useRef<HTMLDivElement | null>(null)
    const { data } = useListingsSearch()
    const { totalHits = 0 } = data ?? {}

    return (
        <section className='flex h-full w-full flex-col'>
            <div ref={scrollUpRef} />
            <div className='my-4 flex justify-between'>
                <ListingResultText totalHits={totalHits} />
                <SortButton />
            </div>
            <ListingGrid />
            <PageNav anchorEle={scrollUpRef} totalHits={totalHits} />
            <ListingPopUpContainer />
        </section>
    )
}
