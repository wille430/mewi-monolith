import { CategoryList } from '@/components/CategoryList/CategoryList'
import { Layout } from '@/components/Layout/Layout'
import { ReactElement } from 'react'

const Kategorier = () => (
    <main className='max-w-2xl mx-auto sm:mt-32 m-0'>
        <CategoryList />
    </main>
)

Kategorier.getLayout = (component: ReactElement) => <Layout>{component}</Layout>

export default Kategorier
