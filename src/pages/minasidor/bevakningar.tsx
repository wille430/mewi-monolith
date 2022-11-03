import type { ReactElement } from 'react'
import Head from 'next/head'
import WatcherList from '@/lib/components/WatcherList/WatcherList'
import { MyAccountLayout } from '@/lib/components/MyPagesLayout/MyPagesLayout'
import { ListingPopUpContainer } from '@/lib/components/ListingPopUp/ListingPopUpContainer'
import { useUser } from '@/lib/hooks/useUser'
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
