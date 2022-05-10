import { PrismaClient, Role } from '@mewi/prisma'
import { Layout } from '@/components/Layout/Layout'
import SideNav from '@/components/SideNav/SideNav'
import { withAuth } from '@/lib/auth'
import { ReactElement } from 'react'
import WatcherList from '@/components/WatcherList/WatcherList'

export const getServerSideProps = withAuth(
    async (req, res) => {
        const prisma = new PrismaClient()
        const { id } = req.session.user

        const watchers = await prisma.userWatcher.findMany({
            where: { userId: id },
            include: {
                watcher: true,
            },
        })

        return {
            props: {
                watchers: watchers,
            },
        }
    },
    [Role.USER]
)

const Bevakningar = ({ watchers }) => {
    return (
        <>
            <aside className='side-col'></aside>
            <main className='main pb-32'>
                <WatcherList watchers={watchers} />
            </main>
            <aside className='side-col'>
                <SideNav />
            </aside>
        </>
    )
}

Bevakningar.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Bevakningar
