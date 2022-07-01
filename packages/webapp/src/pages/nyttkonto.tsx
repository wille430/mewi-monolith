import Head from 'next/head'
import { ReactElement } from 'react'
import { Layout } from '@/components/Layout/Layout'
import { SignUpForm } from '@/components/SignUpForm/SignUpForm'
import { useUser } from '@/hooks/useUser'
import { CreateAccountInformation } from '@/components/CreateAccountInformation'

const NyttKonto = () => {
    useUser({
        redirectIfFound: true,
        redirectTo: '/minasidor',
    })

    return (
        <main>
            <Head>
                <title>Skapa ett konto | Mewi.se</title>
            </Head>

            <section className='divided-content section py-16' style={{ marginTop: '15vh' }}>
                <div className='flex-grow'>
                    <h3 className='text-center mb-8 text-primary'>Nytt konto</h3>
                    <SignUpForm />
                </div>
                <CreateAccountInformation />
            </section>
        </main>
    )
}

NyttKonto.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default NyttKonto
