import WatcherCard from './WatcherCard/WatcherCard'
import WatcherPopUpButton from './WatcherPopUpButton'
import { Container, HorizontalLine } from '@mewi/ui'
import styles from './WatcherList.module.scss'
import { IPopulatedWatcher } from '@wille430/common'
import { useState } from 'react'

interface WatcherListProps {
    watchers: IPopulatedWatcher[]
}

const WatcherList = ({ watchers }: WatcherListProps) => {
    const [expandedId, setExpandedId] = useState<string | undefined>(undefined)

    const renderItems = () => {
        // if (isLoading) {
        //     return (
        //         <div className='flex flex-grow items-center justify-center'>
        //             <div className='h-32'>
        //                 <StyledLoader />
        //             </div>
        //         </div>
        //     )
        // } else {
        if (watchers.length > 0) {
            return (
                <>
                    {watchers.map(
                        (watcherObj, i) =>
                            watcherObj && (
                                <WatcherCard
                                    key={i}
                                    watcher={watcherObj}
                                    expand={expandedId === watcherObj._id}
                                    onExpand={(val?: boolean) => {
                                        if (val) {
                                            setExpandedId(watcherObj._id)
                                        } else {
                                            setExpandedId(undefined)
                                        }
                                    }}
                                />
                            )
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
        // }
    }

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
