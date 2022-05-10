import WatcherCard from './WatcherCard/WatcherCard'
import WatcherPopUpButton from './WatcherPopUpButton'
import { Container, HorizontalLine } from '@mewi/ui'
import styles from './WatcherList.module.scss'
import { ReactElement, useState } from 'react'
import { Watcher, UserWatcher } from '@mewi/prisma'

interface WatcherListProps {
    watchers: (UserWatcher & { watcher: Watcher })[]
}

const WatcherList = ({ watchers }: WatcherListProps) => {
    const [expandedId, setExpandedId] = useState<string | undefined>(undefined)

    const withWrapper = (component: ReactElement) => (
        <Container className={styles.watcherList}>
            <Container.Header>
                <h3>Mina bevakningar</h3>
            </Container.Header>
            <Container.Content className={styles.content}>{component}</Container.Content>
            <HorizontalLine />
            <Container.Footer className='flex justify-end'>
                <WatcherPopUpButton data-testid='createNewWatcherButton' />
            </Container.Footer>
        </Container>
    )

    if (watchers.length === 0) {
        return withWrapper(
            <div className='flex flex-grow items-center justify-center'>
                <div className='h-32'>
                    <span className='text-sm'>Du har inga bevakningar ännu</span>
                </div>
            </div>
        )
    }

    return withWrapper(
        <>
            {watchers.map(
                (watcherObj, i) =>
                    watcherObj && (
                        <WatcherCard
                            key={i}
                            watcher={watcherObj}
                            expand={expandedId === watcherObj.id}
                            onExpand={(val?: boolean) => {
                                if (val) {
                                    setExpandedId(watcherObj.id)
                                } else {
                                    setExpandedId(undefined)
                                }
                            }}
                        />
                    )
            )}
        </>
    )
}

export default WatcherList
