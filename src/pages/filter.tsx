import { useState } from 'react'
import { useRouter } from 'next/router'
import ListingFiltersArea from '@/lib/components/ListingFiltersArea/ListingFiltersArea'
import { BasicLayout } from '@/lib/components/BasicLayout/BasicLayout'
import { Button } from '@/lib/components/Button/Button'
import { ListingSearchFilters } from '@/common/types'
import { NextPageWithLayout } from '@/lib/types/next'
import { stringifySearchPath } from '@/lib/utils/url'

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
