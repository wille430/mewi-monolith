import { SearchSection } from '@/components/SearchSection/SearchSection'
import { ReactElement } from 'react'
import { BasicLayout } from '@/components/BasicLayout/BasicLayout'
import { CategorySideNav } from '@/components/CategorySideNav/CategorySideNav'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Category } from '@mewi/prisma'
import { ListingFiltersProvider } from '@/hooks/useListingFilters'

export const getStaticPaths: GetStaticPaths<{ category: Category }> = () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = (context) => {
    if (context.params?.category.toString().toUpperCase() in Category) {
        return {
            props: {},
        }
    } else {
        return {
            notFound: true,
        }
    }
}

const CategoryPage = () => {
    const router = useRouter()
    const category = (router.query.category as string | undefined)?.toUpperCase()

    return (
        <ListingFiltersProvider defaults={{ category }} excludeInParams={['category']}>
            <aside>
                <CategorySideNav selectedCategory={category as Category} />
            </aside>
            <main>
                <SearchSection />
            </main>
            <aside></aside>
        </ListingFiltersProvider>
    )
}

CategoryPage.getLayout = (component: ReactElement) => <BasicLayout>{component}</BasicLayout>

export default CategoryPage
