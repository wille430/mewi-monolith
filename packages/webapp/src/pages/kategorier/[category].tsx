import { Layout } from '@/components/Layout/Layout'
import { SearchSection } from '@/components/SearchSection/SearchSection'
import { ReactElement } from 'react'
import { useRouter } from 'next/router'

const CategoryPage = () => {
    const router = useRouter()
    const category = (router.query.category as string)?.toUpperCase()

    return (
        <main>
            <SearchSection defaultFilters={{ category }} />
        </main>
    )
}

CategoryPage.getLayout = (component: ReactElement) => <Layout>{component}</Layout>

export default CategoryPage
