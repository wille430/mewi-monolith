import { Layout } from '@/components/Layout/Layout'
import { ListingFilters } from '@/components/ListingFilters/ListingFilters'
import { useListingFilters } from '@/hooks/useListingFilters'
import { Container } from '@mewi/ui'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

const CategoryPage = () => {
    const router = useRouter()
    const category = (router.query.category as string)?.toUpperCase()
    const { filters, setFilters } = useListingFilters({ category }, ['category'])

    return (
        <main>
            <h3>{category}</h3>
            <Container>
                <ListingFilters filters={filters} setFilters={setFilters} />
            </Container>
        </main>
    )
}

CategoryPage.getLayout = (component: ReactElement) => <Layout>{component}</Layout>

export default CategoryPage
