import Head from 'next/head'
import type { ReactElement } from 'react'
import { CreateAccountInformation } from './../components/CreateAccountInformation'
import { Layout } from '@/lib/components/Layout/Layout'
import { EmailSignInForm } from '@/lib/components/EmailSignInForm/EmailSignInForm'
import { useUser } from '@/lib/hooks/useUser'

const Login = () => {
    useUser({
        redirectIfFound: true,
        redirectTo: '/minasidor',
    })

    return (
        <main className='p-4'>
            <Head>
                <title>Logga in | Mewi.se</title>
            </Head>

            <section className='divided-content section p-0' style={{ marginTop: '15vh' }}>
                <div className='flex-grow p-4 py-16'>
                    <h3 className='mb-8 text-center text-primary'>Logga in</h3>
                    <EmailSignInForm />
                </div>
                <CreateAccountInformation />
            </section>
        </main>
    )
}

Login.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Login
