import Head from 'next/head'
import { ReactElement } from 'react'
import { CreateAccountInformation } from './../components/CreateAccountInformation'
import { Layout } from '@/components/Layout/Layout'
import { EmailSignInForm } from '@/components/EmailSignInForm/EmailSignInForm'
import { useUser } from '@/hooks/useUser'

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
                    <h3 className='text-center mb-8 text-primary'>Logga in</h3>
                    <EmailSignInForm />
                </div>
                <CreateAccountInformation />
            </section>
        </main>
    )
}

Login.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Login
