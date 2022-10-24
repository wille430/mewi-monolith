import type { ReactElement } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { SearchSection } from '@/components/SearchSection/SearchSection'
import { ListingFiltersProvider } from '@/hooks/useListingFilters'
import { SideFilters } from '@/components/SideFilters/SideFilters'
import { Layout } from '@/components/Layout/Layout'
import { SearchInput } from '@/components/SearchInput/SearchInput'

const SearchPage = () => {
    const router = useRouter()

    return (
        <>
            <Head>
                <title>"{router.query.keyword ?? ''}" | Mewi.se</title>
            </Head>

            <ListingFiltersProvider>
                <aside>
                    <SideFilters />
                </aside>
                <main>
                    <SearchInput className='border-2 border-r-0' />

                    <SearchSection />
                </main>
                <aside />
            </ListingFiltersProvider>
        </>
    )
}

SearchPage.getLayout = (component: ReactElement) => (
    <Layout>
        <div className='search-layout'>{component}</div>
    </Layout>
)

export default SearchPage
