import { UpdatePasswordForm } from './../lib/components/UpdatePasswordForm/UpdatePasswordForm'
import type { ReactElement } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Layout } from '@/lib/components/Layout/Layout'
import { useUser } from '@/lib/hooks/useUser'
import { Container } from '@/lib/components/Container/Container'

const ForgottenPassword = () => {
    useUser({
        redirectIfFound: true,
        redirectTo: '/minasidor',
    })

    const router = useRouter()

    useEffect(() => {
        const { email, token } = router.query
        if ((!email || !token) && router.isReady) {
            router.push('/')
        }
    }, [router.isReady])

    return (
        <>
            <Head>
                <title>Nytt lösenord | Mewi.se</title>
            </Head>

            <main>
                <Container
                    className='mx-auto max-w-lg'
                    style={{
                        marginTop: '15vh',
                    }}
                >
                    <Container.Header>
                        <h3 className='pb-6 pt-4 text-center'>Nytt lösenord</h3>
                    </Container.Header>
                    <Container.Content>
                        <UpdatePasswordForm
                            initialValues={{
                                email: router.query.email as string,
                                token: router.query.token as string,
                            }}
                        />
                    </Container.Content>
                    <Container.Footer>
                        <div className='pt-6'></div>
                    </Container.Footer>
                </Container>
            </main>
        </>
    )
}

ForgottenPassword.getLayout = (component: ReactElement) => <Layout>{component}</Layout>

export default ForgottenPassword
