import { Role } from '@prisma/client'
import { IPopulatedWatcher } from '@wille430/common'
import { Layout } from '@/components/Layout/Layout'
import SideNav from '@/components/SideNav/SideNav'
import { withAuth } from '@/lib/auth'
import { ReactElement } from 'react'

export const getServerSideProps = withAuth(async () => {
    return {
        props: {
            watchers: [] as IPopulatedWatcher[],
        },
    }
}, [Role.USER])

const Bevakningar = ({ watchers }) => {
    return (
        <>
            <aside className='side-col'></aside>
            <main className='main pb-32'>{/* <WatcherList watchers={watchers} /> */}</main>
            <aside className='side-col'>
                <SideNav />
            </aside>
        </>
    )
}

Bevakningar.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Bevakningar
