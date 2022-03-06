import WatcherCard from './WatcherCard/WatcherCard'
import StyledLoader from 'components/StyledLoader'
import WatcherPopUpButton from './WatcherPopUpButton'
import { getAllWatchers } from 'store/watchers/creators'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'hooks/hooks'
import { useEffect } from 'react'
import { Container, HorizontalLine } from '@mewi/ui'
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
                    <>
                        {watchers.map(
                            (watcherObj, i) =>
                                watcherObj && <WatcherCard key={i} watcher={watcherObj} />
                        )}
                    </>
                )
            } else {
                return (
                    <div className='flex flex-grow items-center justify-center'>
                        <div className='h-32'>
                            <span className='text-sm'>Du har inga bevakningar ännu</span>
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
            <Container.Content className={styles.content}>{renderItems()}</Container.Content>
            <HorizontalLine />
            <Container.Footer className='flex justify-end'>
                <WatcherPopUpButton data-testid='createNewWatcherButton' />
            </Container.Footer>
        </Container>
    )
}

export default WatcherList
