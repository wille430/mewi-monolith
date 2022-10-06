import { Container, HorizontalLine } from '@wille430/ui'
import { ReactElement } from 'react'
import { Role, IUser } from '@wille430/common'
import Head from 'next/head'
import { withAuth } from '@/lib/auth'
import { logoutSession } from '@/lib/session'
import AccountDetails from '@/components/AccountDetails/AccountDetails'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'
import { dbConnection } from '@/lib/dbConnection'
import { ObjectId } from 'mongodb'
import { serialize } from '@/lib/serialize'

interface KontoPageProps {
    user: IUser
}

export const getServerSideProps = withAuth(
    async (req) => {
        const userId = req.session.user.id

        const db = await dbConnection()
        const usersCollection = db.collection<IUser>('users')
        const user = await usersCollection.findOne({
            _id: ObjectId(userId),
        })

        if (!user || user._id.toString() !== userId) {
            return logoutSession(req)
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
