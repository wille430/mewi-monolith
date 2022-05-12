import { Layout } from '@/components/Layout/Layout'
import { SearchSection } from '@/components/SearchSection/SearchSection'
import { ReactElement } from 'react'

const SearchPage = () => {
    return (
        <main>
            <SearchSection />
        </main>
    )
}

SearchPage.getLayout = (component: ReactElement) => <Layout>{component}</Layout>

export default SearchPage
