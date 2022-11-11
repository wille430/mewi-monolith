import type { ReactElement } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { SearchSection } from '@/lib/components/SearchSection/SearchSection'
import { SideFilters } from '@/lib/components/SideFilters/SideFilters'
import { Layout } from '@/lib/components/Layout/Layout'
import { SearchInput } from '@/lib/components/SearchInput/SearchInput'
import { SearchProvider } from '@/lib/hooks/useSearch'
import { searchListingsSchema } from '@/lib/client/listings/schemas/search-listings.schema'

const SearchPage = () => {
    const router = useRouter()

    return (
        <>
            <Head>
                <title>
                    {'"'}
                    {router.query.keyword ?? ''}
                    {'"'}| Mewi.se
                </title>
            </Head>

            <SearchProvider search={[searchListingsSchema]}>
                <aside>
                    <SideFilters />
                </aside>
                <main>
                    <SearchInput className='border-2 border-r-0' />

                    <SearchSection />
                </main>
                <aside />
            </SearchProvider>
        </>
    )
}

SearchPage.getLayout = (component: ReactElement) => (
    <Layout>
        <div className='search-layout'>{component}</div>
    </Layout>
)

export default SearchPage
