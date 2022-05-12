import { BasicLayout } from '@/components/BasicLayout/BasicLayout'
import { CategorySideNav } from '@/components/CategorySideNav/CategorySideNav'
import { SearchSection } from '@/components/SearchSection/SearchSection'
import { ReactElement } from 'react'

const SearchPage = () => {
    return (
        <>
            <aside>
                <CategorySideNav />
            </aside>
            <main>
                <SearchSection />
            </main>
            <aside />
        </>
    )
}

SearchPage.getLayout = (component: ReactElement) => <BasicLayout>{component}</BasicLayout>

export default SearchPage
