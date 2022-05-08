import { Layout } from '@/components/Layout/Layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import SignInWithEmail from '@/components/SignInWithEmail/SignInWithEmail'
import { ReactElement } from 'react'

const Login = () => {
    const router = useRouter()

    return (
        <>
            <Head>
                <title>Logga in | Mewi.se</title>
            </Head>
            <section style={{ paddingTop: '15vh' }}>
                <SignInWithEmail />
            </section>
        </>
    )
}

Login.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Login
