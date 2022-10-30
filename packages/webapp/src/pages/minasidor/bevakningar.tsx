import type { ReactElement } from 'react'
import { useEffect } from 'react'
import Head from 'next/head'
import { useQuery } from 'react-query'
import WatcherList from '@/components/WatcherList/WatcherList'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'
import { ListingPopUpContainer } from '@/components/ListingPopUp/ListingPopUpContainer'
import { instance } from '@/lib/axios'
import { useUser } from '@/hooks/useUser'
import { ON_UNAUTHENTICATED_GOTO } from '@/constants/paths'

const Bevakningar = () => {
    const { data: watchers, refetch: fetchWatchers } = useQuery(
        'user-watchers',
        () => instance.get('/user-watchers').then((res) => res.data),
        {
            initialData: [],
            refetchOnMount: false,
        }
    )

    const { user } = useUser({
        redirectTo: ON_UNAUTHENTICATED_GOTO,
    })

    useEffect(() => {
        if (user) {
            fetchWatchers()
        }
    }, [user])

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
