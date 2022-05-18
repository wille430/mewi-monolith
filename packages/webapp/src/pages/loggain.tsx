import Head from 'next/head'
import { ReactElement } from 'react'
import { Layout } from '@/components/Layout/Layout'
import SignInWithEmail from '@/components/SignInWithEmail/SignInWithEmail'
import { useUser } from '@/lib/useUser'

const Login = () => {
    useUser({
        redirectIfFound: true,
        redirectTo: '/',
    })

    return (
        <main>
            <Head>
                <title>Logga in | Mewi.se</title>
            </Head>
            <section style={{ paddingTop: '15vh' }}>
                <SignInWithEmail />
            </section>
        </main>
    )
}

Login.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Login
