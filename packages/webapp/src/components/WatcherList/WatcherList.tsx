import WatcherCard from './WatcherCard/WatcherCard'
import WatcherPopUpButton from './WatcherPopUpButton'
import { Container, HorizontalLine } from '@mewi/ui'
import styles from './WatcherList.module.scss'
import { ReactElement, useState } from 'react'
import { PopulatedUserWatcher } from '@wille430/common'
import { useQuery } from 'react-query'
import axios from 'axios'

interface WatcherListProps {
    watchers: PopulatedUserWatcher[]
}

const WatcherList = ({ watchers }: WatcherListProps) => {
    const [expandedId, setExpandedId] = useState<string | undefined>(undefined)

    const { data } = useQuery(
        'watchers',
        () => axios.get<PopulatedUserWatcher[]>('/users/me/watchers').then((res) => res.data),
        {
            initialData: watchers ?? [],
            enabled: false,
            keepPreviousData: true,
        }
    )

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

    if (data.length === 0) {
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
            {data.map(
                (watcherObj, i) =>
                    watcherObj && (
                        <WatcherCard
                            key={i}
                            userWatcher={watcherObj}
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
