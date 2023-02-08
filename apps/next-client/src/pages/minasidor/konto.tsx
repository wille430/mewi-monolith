import type { ReactElement } from 'react'
import Head from 'next/head'
import AccountDetails from '@/lib/components/AccountDetails/AccountDetails'
import { MyAccountLayout } from '@/lib/components/MyPagesLayout/MyPagesLayout'
import { serialize } from '@/lib/utils/serialize'
import { ON_UNAUTHENTICATED_GOTO } from '@/lib/constants/paths'
import { withAuth } from '@/lib/session/withAuth'
import { Container } from '@/lib/components/Container/Container'
import { HorizontalLine } from '@/lib/components/HorizontalLine/HorizontalLine'
import { IUser, Role } from '@/common/schemas'

interface KontoPageProps {
    user: IUser
}

export const getServerSideProps = withAuth(
    async ({ req }) => {
        await import('reflect-metadata')
        const container = await import('tsyringe').then(({ container }) => container)
        const UsersService = await import('@/lib/modules/users/users.service').then(
            ({ UsersService }) => UsersService
        )
        const usersService = container.resolve(UsersService)

        const userId = req.session.user?.userId
        const user = userId ? await usersService.findOne(userId) : undefined

        if (!user) {
            return {
                redirect: {
                    destination: ON_UNAUTHENTICATED_GOTO,
                    permanent: false,
                },
            }
        }

        return {
            props: {
                user: serialize(user),
            } as KontoPageProps,
        }
    },
    [Role.USER]
)

const Konto = ({ user }: KontoPageProps) => {
    return (
        <>
            <Head>
                <title>Mitt konto | Mewi.se</title>
            </Head>

            <main>
                <Container
                    style={{
                        minHeight: '50vh',
                    }}
                >
                    <Container.Header>
                        <h3>Mitt Konto</h3>
                        <HorizontalLine />
                    </Container.Header>

                    <Container.Content>
                        <AccountDetails user={user} />
                    </Container.Content>
                    <Container.Footer></Container.Footer>
                </Container>
            </main>
        </>
    )
}

Konto.getLayout = (component: ReactElement) => <MyAccountLayout>{component}</MyAccountLayout>

export default Konto
