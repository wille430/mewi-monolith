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
        <main>
            <Head>
                <title>Logga in | Mewi.se</title>
            </Head>

            <section className='divided-content section py-16' style={{ marginTop: '15vh' }}>
                <div className='flex-grow'>
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
