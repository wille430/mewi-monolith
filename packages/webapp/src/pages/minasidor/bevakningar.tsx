import { ReactElement, useEffect } from 'react'
import Head from 'next/head'
import WatcherList from '@/components/WatcherList/WatcherList'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'
import { ListingPopUpContainer } from '@/components/ListingPopUp/ListingPopUpContainer'
import { useQuery } from 'react-query'
import { instance } from '@/lib/axios'
import { useUser } from '@/hooks/useUser'

const Bevakningar = () => {
    const { data: watchers, refetch: fetchWatchers } = useQuery(
        'user-watchers',
        () => instance.get('/users/me/watchers').then((res) => res.data),
        {
            initialData: [],
            refetchOnMount: false,
        }
    )

    const { user } = useUser({
        redirectTo: '/loggain',
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
