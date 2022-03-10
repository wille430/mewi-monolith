import Layout from 'components/Layout'
import SideNav from 'components/SideNav/SideNav'
import WatcherList from './WatcherList/WatcherList'

const Bevakningar = () => {
    return (
        <Layout>
            <aside className='side-col'></aside>
            <main className='main pb-32'>
                <WatcherList />
            </main>
            <aside className='side-col'>
                <SideNav />
            </aside>
        </Layout>
    )
}

export default Bevakningar
