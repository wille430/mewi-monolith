import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { BasicLayout } from '@/components/BasicLayout/BasicLayout'
import { CategorySideNav } from '@/components/CategorySideNav/CategorySideNav'
import { SearchSection } from '@/components/SearchSection/SearchSection'
import { ListingFiltersProvider } from '@/hooks/useListingFilters'

const SearchPage = () => {
    const router = useRouter()

    return (
        <>
            <Head>
                <title>"{router.query.keyword ?? ''}" | Mewi.se</title>
            </Head>

            <ListingFiltersProvider>
                <aside>
                    <CategorySideNav />
                </aside>
                <main>
                    <SearchSection />
                </main>
                <aside />
            </ListingFiltersProvider>
        </>
    )
}

SearchPage.getLayout = (component: ReactElement) => <BasicLayout>{component}</BasicLayout>

export default SearchPage
