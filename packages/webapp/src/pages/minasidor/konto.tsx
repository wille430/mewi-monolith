import { withAuth } from '@/lib/auth'
import { Container, HorizontalLine } from '@mewi/ui'
import { ReactElement } from 'react'
import { Role, PrismaClient, User } from '@mewi/prisma'
import { logoutSession } from '@/lib/session'
import AccountDetails from '@/components/AccountDetails/AccountDetails'
import { MyAccountLayout } from '@/components/MyAccountLayout/MyAccountLayout'

interface KontoPageProps {
    user: User
}

export const getServerSideProps = withAuth(
    async (req, res) => {
        const prisma = new PrismaClient()
        const userId = req.session.user.id
        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!user) {
            return logoutSession(req)
        }

        return {
            props: {
                user,
            } as KontoPageProps,
        }
    },
    [Role.USER]
)

const Konto = ({ user }: KontoPageProps) => {
    return (
        <main>
            <Container>
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
    )
}

Konto.getLayout = (component: ReactElement) => <MyAccountLayout>{component}</MyAccountLayout>

export default Konto
