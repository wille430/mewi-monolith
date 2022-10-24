import { useState } from 'react'
import type { ListingSearchFilters } from '@wille430/common'
import { Button } from '@wille430/ui'
import { useRouter } from 'next/router'
import ListingFiltersArea from '@/components/ListingFiltersArea/ListingFiltersArea'
import type { NextPageWithLayout } from '@/types/next'
import { stringifySearchPath } from '@/hooks/useListingFilters'
import { BasicLayout } from '@/components/BasicLayout/BasicLayout'

const Filter: NextPageWithLayout = () => {
    const [filters, setFilters] = useState<ListingSearchFilters>({})
    const router = useRouter()

    const handleClick = () => {
        router.push(stringifySearchPath(filters))
    }

    return (
        <>
            <aside></aside>
            <main>
                <ListingFiltersArea
                    footer={<Button label='Sök med filter' onClick={handleClick} />}
                    showCategory
                    {...{ filters, setFilters }}
                />
            </main>
            <aside></aside>
        </>
    )
}

Filter.getLayout = (component) => <BasicLayout>{component}</BasicLayout>

export default Filter
