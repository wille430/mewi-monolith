import Head from 'next/head'
import type { ReactElement } from 'react'
import { Layout } from '@/lib/components/Layout/Layout'
import { SignUpForm } from '@/lib/components/SignUpForm/SignUpForm'
import { useUser } from '@/lib/hooks/useUser'
import { CreateAccountInformation } from '@/lib/components/CreateAccountInformation'

const NyttKonto = () => {
    useUser({
        redirectIfFound: true,
        redirectTo: '/minasidor',
    })

    return (
        <main className='p-4'>
            <Head>
                <title>Skapa ett konto | Mewi.se</title>
            </Head>

            <section className='divided-content section p-0' style={{ marginTop: '15vh' }}>
                <div className='flex-grow p-4 py-16'>
                    <h3 className='mb-8 text-center text-primary'>Nytt konto</h3>
                    <SignUpForm />
                </div>
                <CreateAccountInformation />
            </section>
        </main>
    )
}

NyttKonto.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default NyttKonto
