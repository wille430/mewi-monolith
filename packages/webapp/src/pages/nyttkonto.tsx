import Head from 'next/head'
import { ReactElement } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { SignUpForm } from '@/components/SignUpForm/SignUpForm'
import { useUser } from '@/lib/useUser'

const NyttKonto = () => {
    useUser({
        redirectIfFound: true,
        redirectTo: '/',
    })

    return (
        <main>
            <Head>
                <title>Skapa ett konto | Mewi.se</title>
            </Head>
            <section style={{ paddingTop: '15vh' }}>
                <SignUpForm />
            </section>
        </main>
    )
}

NyttKonto.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default NyttKonto
