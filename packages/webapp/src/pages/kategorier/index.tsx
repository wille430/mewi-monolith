import type { ReactElement } from 'react'
import Head from 'next/head'
import { CategoryList } from '@/components/CategoryList/CategoryList'
import { Layout } from '@/components/Layout/Layout'

const Kategorier = () => (
    <main className='max-w-2xl mx-auto sm:mt-32 m-0'>
        <Head>
            <title>Alla Kategorier | Mewi.se</title>
        </Head>

        <h3>Alla Kategorier</h3>
        <CategoryList />
    </main>
)

Kategorier.getLayout = (component: ReactElement) => <Layout>{component}</Layout>

export default Kategorier
