import WatcherCard from './WatcherCard/WatcherCard'
import StyledLoader from 'components/StyledLoader'
import WatcherPopUpButton from './WatcherPopUpButton'
import { getAllWatchers } from 'store/watchers/creators'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'hooks/hooks'
import { useEffect } from 'react'
import { Container } from '@mewi/ui'
import styles from './WatcherList.module.scss'

const WatcherList = () => {
    const { isLoading, watchers } = useAppSelector((state) => state.watchers)

    const dispatch = useDispatch()

    const renderItems = () => {
        if (isLoading) {
            return (
                <div className='flex flex-grow items-center justify-center'>
                    <div className='h-32'>
                        <StyledLoader />
                    </div>
                </div>
            )
        } else {
            if (watchers.length > 0) {
                return (
                    <div className='grid w-full space-y-8'>
                        {watchers.map(
                            (watcherObj, i) =>
                                watcherObj && <WatcherCard key={i} watcher={watcherObj} />
                        )}
                    </div>
                )
            } else {
                return (
                    <div className='flex flex-grow items-center justify-center'>
                        <div className='h-32'>
                            <span className='text-sm text-white'>Du har inga bevakningar ännu</span>
                        </div>
                    </div>
                )
            }
        }
    }

    useEffect(() => {
        dispatch(getAllWatchers())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container className={styles.watcherList}>
            <Container.Header>
                <h3>Mina bevakningar</h3>
            </Container.Header>
            <Container.Content className={'flex flex-col space-y-2'}>
                {renderItems()}
            </Container.Content>
            <Container.Footer className='flex justify-end pt-4'>
                <WatcherPopUpButton data-testid='createNewWatcherButton' />
            </Container.Footer>
        </Container>
    )
}

export default WatcherList
