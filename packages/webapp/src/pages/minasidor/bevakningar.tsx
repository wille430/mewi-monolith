import { Role } from '@mewi/prisma'
import { ReactElement } from 'react'
import { withAuth } from '@/lib/auth'
import WatcherList from '@/components/WatcherList/WatcherList'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'
import { serialize } from '@/lib/serialize'
import prisma from '@/lib/prisma'
import { ListingPopUpContainer } from '@/components/ListingPopUp/ListingPopUp'

export const getServerSideProps = withAuth(
    async (req) => {
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
            <ListingPopUpContainer />
        </main>
    )
}

Bevakningar.getLayout = (page: ReactElement) => <MyAccountLayout>{page}</MyAccountLayout>

export default Bevakningar
