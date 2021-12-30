import Layout from 'components/Layout'
import SnackbarHandler from 'components/SnackbarHandler'
import { useAppSelector } from 'hooks/hooks'
import WatcherList from './WatcherList'

const Bevakningar = () => {
    const { error } = useAppSelector((state) => state.watchers)

    return (
        <Layout>
            <main className='main pb-32'>
                <WatcherList />
                <SnackbarHandler message={error} type='error' />
            </main>
        </Layout>
    )
}

export default Bevakningar
