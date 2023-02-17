import type { ReactElement } from 'react'
import Head from 'next/head'
import WatcherList from '@/components/WatcherList/WatcherList'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'
import { ListingPopUpContainer } from '@/components/ListingPopUp/ListingPopUpContainer'
import { useUser } from '@/hooks/useUser'
import { ON_UNAUTHENTICATED_GOTO } from '@/lib/constants/paths'

const Bevakningar = () => {
    useUser({
        redirectTo: ON_UNAUTHENTICATED_GOTO,
    })

    return (
        <>
            <Head>
                <title>Mina bevakningar | Mewi.se</title>
            </Head>
            <main>
                <WatcherList />
                <ListingPopUpContainer />
            </main>
        </>
    )
}

Bevakningar.getLayout = (page: ReactElement) => <MyAccountLayout>{page}</MyAccountLayout>

export default Bevakningar
