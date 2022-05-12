import { SearchSection } from '@/components/SearchSection/SearchSection'
import { ReactElement } from 'react'
import { BasicLayout } from '@/components/BasicLayout/BasicLayout'
import { CategorySideNav } from '@/components/CategorySideNav/CategorySideNav'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Category } from '@mewi/prisma'

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
        <>
            <aside>
                <CategorySideNav selectedCategory={category} />
            </aside>
            <main>
                <SearchSection defaultFilters={{ category }} />
            </main>
            <aside></aside>
        </>
    )
}

CategoryPage.getLayout = (component: ReactElement) => <BasicLayout>{component}</BasicLayout>

export default CategoryPage
