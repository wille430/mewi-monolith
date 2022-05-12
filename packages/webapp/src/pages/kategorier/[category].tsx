import { Layout } from '@/components/Layout/Layout'
import { ListingFilters } from '@/components/ListingFilters/ListingFilters'
import ListingGrid from '@/components/ListingGrid/ListingGrid'
import { useListingFilters } from '@/hooks/useListingFilters'
import { Container } from '@mewi/ui'
import axios from 'axios'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useQuery } from 'react-query'
import queryString from 'query-string'
import { Listing } from '@mewi/prisma'

const CategoryPage = () => {
    const router = useRouter()
    const category = (router.query.category as string)?.toUpperCase()
    const { filters, debouncedFilters, setFilters } = useListingFilters({ category }, ['category'])

    const { data: listings } = useQuery(
        ['listings', debouncedFilters],
        () =>
            axios
                .get<{ hits: Listing[] }>('/listings?' + queryString.stringify(debouncedFilters))
                .then((res) => res.data?.hits),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    )

    return (
        <main>
            <section className='max-w-4xl mx-auto'>
                <h3>{category}</h3>
                <Container className='mb-12'>
                    <ListingFilters filters={filters} setFilters={setFilters} />
                </Container>
                <ListingGrid listings={listings} />
            </section>
        </main>
    )
}

CategoryPage.getLayout = (component: ReactElement) => <Layout>{component}</Layout>

export default CategoryPage
