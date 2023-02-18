import type {ReactElement} from 'react'
import Head from 'next/head'
import WatcherList from '@/components/WatcherList/WatcherList'
import {MyAccountLayout} from '@/components/MyAccountLayout/MyAccountLayout'
import {ListingPopUpContainer} from '@/components/ListingPopUp/ListingPopUpContainer'

const Bevakningar = () => {
    return (
        <>
            <Head>
                <title>Mina bevakningar | Mewi.se</title>
            </Head>
            <main>
                <WatcherList/>
                <ListingPopUpContainer/>
            </main>
        </>
    )
}

Bevakningar.getLayout = (page: ReactElement) => <MyAccountLayout>{page}</MyAccountLayout>

export default Bevakningar
