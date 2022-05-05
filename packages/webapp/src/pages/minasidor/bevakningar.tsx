import { IPopulatedWatcher } from '@wille430/common'
import { Layout } from 'components/Layout/Layout'
import SideNav from 'components/SideNav/SideNav'
import WatcherList from 'components/WatcherList/WatcherList'
import { GetServerSideProps } from 'next'
import { ReactElement } from 'react'

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {
            watchers: [] as IPopulatedWatcher[],
        },
    }
}

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
