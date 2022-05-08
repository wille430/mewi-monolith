import { Layout } from '@/components/Layout/Layout'
import { SignUpForm } from '@/components/SignUpForm/SignUpForm'
import { wrapper } from '@/store'
import Head from 'next/head'
import { ReactElement } from 'react'
import { useStore } from 'react-redux'

export const getInitialProps = wrapper.getInitialPageProps((store) => ({ pathname, req, res }) => {
    console.log(pathname, store.getState())
})

const NyttKonto = () => {
    const store = useStore()

    console.log(store)

    return (
        <>
            <Head>
                <title>Skapa ett konto | Mewi.se</title>
            </Head>
            <section style={{ paddingTop: '15vh' }}>
                <SignUpForm />
            </section>
        </>
    )
}

NyttKonto.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default NyttKonto
