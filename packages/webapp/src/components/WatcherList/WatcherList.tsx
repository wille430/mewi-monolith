import { Container, HorizontalLine } from '@wille430/ui'
import { ReactElement, useState } from 'react'
import { IUserWatcher } from '@wille430/common'
import { useQuery } from 'react-query'
import dynamic from 'next/dynamic'
import styles from './WatcherList.module.scss'
import WatcherPopUpButton from './WatcherPopUpButton'
import { instance } from '@/lib/axios'

const WatcherCard = dynamic(() => import('./WatcherCard/WatcherCard'))

interface WatcherListProps {
    watchers: IUserWatcher[]
}

const WatcherList = ({ watchers }: WatcherListProps) => {
    const [expandedId, setExpandedId] = useState<string | undefined>(undefined)

    const { data } = useQuery(
        'watchers',
        () => instance.get<IUserWatcher[]>('/users/me/watchers').then((res) => res.data),
        {
            initialData: watchers ?? [],
            enabled: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
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
