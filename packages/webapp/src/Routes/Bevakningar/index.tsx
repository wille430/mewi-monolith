import Layout from 'common/components/Layout'
import { WatcherProvider } from './WatcherContext'
import WatcherList from './WatcherList'

const Bevakningar = () => {
    return (
        <Layout>
            <main className='main pb-32'>
                <WatcherProvider>
                    <WatcherList />
                </WatcherProvider>
            </main>
        </Layout>
    )
}

export default Bevakningar
