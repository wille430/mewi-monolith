import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { SearchSection } from '@/components/SearchSection/SearchSection'
import { ListingFiltersProvider } from '@/hooks/useListingFilters'
import { SideFilters } from '@/components/SideFilters/SideFilters'
import { Layout } from '@/components/Layout/Layout'

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
