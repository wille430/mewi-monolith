import { PrismaClient, Role } from '@mewi/prisma'
import { withAuth } from '@/lib/auth'
import { ReactElement } from 'react'
import WatcherList from '@/components/WatcherList/WatcherList'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'
import { serialize } from '@/lib/serialize'

export const getServerSideProps = withAuth(
    async (req) => {
        const prisma = new PrismaClient()
        const { id } = req.session.user

        const watchers =
            (await prisma.userWatcher.findMany({
                where: { userId: id },
                include: {
                    watcher: true,
                },
            })) ?? []

        return {
            props: {
                watchers: serialize(watchers),
            },
        }
    },
    [Role.USER]
)

const Bevakningar = ({ watchers }) => {
    return (
        <main>
            <WatcherList watchers={watchers} />
        </main>
    )
}

Bevakningar.getLayout = (page: ReactElement) => <MyAccountLayout>{page}</MyAccountLayout>

export default Bevakningar
