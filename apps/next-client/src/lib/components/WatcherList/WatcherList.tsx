import type { ReactElement } from 'react'
import { useState } from 'react'
import type { IUserWatcher } from '@/common/schemas'
import dynamic from 'next/dynamic'
import styles from './WatcherList.module.scss'
import WatcherPopUpButton from './WatcherPopUpButton'
import { Container } from '../Container/Container'
import { HorizontalLine } from '../HorizontalLine/HorizontalLine'
import useSWR from 'swr'
import { MY_WATCHERS_KEY } from '@/lib/client/user-watchers/swr-keys'

const WatcherCard = dynamic(() => import('./WatcherCard/WatcherCard'))

const WatcherList = () => {
    const [expandedId, setExpandedId] = useState<string | undefined>(undefined)

    const { data = [] } = useSWR<IUserWatcher[]>(MY_WATCHERS_KEY)

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

    if (data?.length === 0) {
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
            {data?.map(
                (watcherObj, i) =>
                    watcherObj && (
                        <WatcherCard
                            key={watcherObj.id}
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
