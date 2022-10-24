import { Container, HorizontalLine } from '@wille430/ui'
import type { ReactElement } from 'react'
import type { IUser } from '@wille430/common'
import { Role } from '@wille430/common'
import Head from 'next/head'
import { ObjectId } from 'mongodb'
import AccountDetails from '@/components/AccountDetails/AccountDetails'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'
import { dbConnection } from '@/lib/dbConnection'
import { serialize } from '@/lib/serialize'
import { withAuth } from '@/lib/auth/withAuth'
import { ON_UNAUTHENTICATED_GOTO } from '@/constants/paths'

interface KontoPageProps {
    user: IUser
}

export const getServerSideProps = withAuth(
    async ({ req }) => {
        const userId = req.user?.id

        const db = await dbConnection()
        const usersCollection = db.collection<IUser>('users')
        const user = await usersCollection.findOne({
            _id: new ObjectId(userId),
        })

        if (!user || user._id.toString() !== userId) {
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
