import { Layout } from '@/components/Layout/Layout'
import { SignUpForm } from '@/components/SignUpForm/SignUpForm'
import Head from 'next/head'
import { ReactElement } from 'react'

const NyttKonto = () => {
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