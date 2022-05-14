import { Layout } from '@/components/Layout/Layout'
import Head from 'next/head'
import SignInWithEmail from '@/components/SignInWithEmail/SignInWithEmail'
import { ReactElement } from 'react'

const Login = () => {
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
