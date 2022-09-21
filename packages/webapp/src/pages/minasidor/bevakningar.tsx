import { Role } from '@mewi/prisma/index-browser'
import { ReactElement } from 'react'
import Head from 'next/head'
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
        <>
            <Head>
                <title>Mina bevakningar | Mewi.se</title>
            </Head>
            <main>
                <WatcherList watchers={watchers} />
                <ListingPopUpContainer />
            </main>
        </>
    )
}

Bevakningar.getLayout = (page: ReactElement) => <MyAccountLayout>{page}</MyAccountLayout>

export default Bevakningar
