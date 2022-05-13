import { BasicLayout } from '@/components/BasicLayout/BasicLayout'
import { CategorySideNav } from '@/components/CategorySideNav/CategorySideNav'
import { SearchSection } from '@/components/SearchSection/SearchSection'
import { ListingFiltersProvider } from '@/hooks/useListingFilters'
import { ReactElement } from 'react'

const SearchPage = () => {
    return (
        <ListingFiltersProvider>
            <aside>
                <CategorySideNav />
            </aside>
            <main>
                <SearchSection />
            </main>
            <aside />
        </ListingFiltersProvider>
    )
}

SearchPage.getLayout = (component: ReactElement) => <BasicLayout>{component}</BasicLayout>

export default SearchPage
