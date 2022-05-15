import ExpandButton from './ExpandButton/ExpandButton'
import { capitalize, CategoryLabel, PopulatedUserWatcher } from '@wille430/common'
import { Listing } from '@mewi/prisma'
import RemoveButton from './RemoveWatcherButton'
import { Button } from '@mewi/ui'
import queryString from 'query-string'
import _ from 'lodash'
import { Dispatch, useEffect, useRef, useState } from 'react'
import styles from './WatcherCard.module.scss'
import { AnimatePresence } from 'framer-motion'
import NewItemsDrawer from './NewItemsDrawer/NewItemsDrawer'
import { useRouter } from 'next/router'

const WatcherCard = ({
    userWatcher,
    newItems,
    expand,
    onExpand,
}: {
    userWatcher: PopulatedUserWatcher
    newItems?: Listing[]
    expand?: boolean
    onExpand?: Dispatch<boolean>
}) => {
    const router = useRouter()
    const [_expand, _setExpand] = expand && onExpand ? [expand, onExpand] : useState(false)
    const { watcher } = userWatcher

    const scrollRef = useRef<HTMLDivElement>(null)

    const handleSearchButtonClick = () => {
        const filters = _.omit(watcher.metadata, ['category'])
        let pathname = '/search'

        if (watcher.metadata.category) {
            pathname = `/kategorier/${watcher.metadata.category}`.toLowerCase()
        }

        router.push({
            pathname,
            search: queryString.stringify(filters),
        })
    }

    const handleExpand = () => {
        _setExpand(!_expand)
    }

    const regionsString = () => {
        if (typeof watcher.metadata.regions === 'string') return watcher.metadata.regions

        return watcher.metadata.regions?.map((x: string) => capitalize(x)).join(', ')
    }

    useEffect(() => {
        if (_expand) scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, [_expand])

    return (
        <div className={styles.watcherCardContainer} ref={scrollRef}>
            <article
                className='flex flex-col rounded-md bg-white p-4 shadow-sm border-2'
                data-testid='watcherCard'
            >
                {watcher.metadata.keyword && (
                    <header className='mb-4 flex-none'>
                        <label className='label'>Sökord:</label>
                        <span>{watcher.metadata.keyword}</span>
                    </header>
                )}
                <div className='flex flex-grow space-y-4'>
                    <div className='grid flex-1 grid-cols-fit-12 gap-4'>
                        {watcher.metadata.regions && watcher.metadata.regions.length >= 1 ? (
                            <div className='mr-6'>
                                <label className='label'>Regioner:</label>
                                <span>{regionsString()}</span>
                            </div>
                        ) : (
                            <div></div>
                        )}

                        {watcher.metadata.category ? (
                            <div className='mr-6'>
                                <label className='label'>Kategori:</label>
                                <span>{CategoryLabel[watcher.metadata.category]}</span>
                            </div>
                        ) : (
                            <div></div>
                        )}
                        {watcher.metadata.priceRangeGte || watcher.metadata.priceRangeLte ? (
                            <div className='mr-6'>
                                <label className='label'>Prisintervall:</label>
                                <span>
                                    {(watcher.metadata.priceRangeGte || '0') +
                                        '-' +
                                        (watcher.metadata.priceRangeLte
                                            ? watcher.metadata.priceRangeLte + 'kr'
                                            : '')}
                                </span>
                            </div>
                        ) : (
                            <div></div>
                        )}
                        {watcher.metadata.auction ? (
                            <div className='mr-6'>
                                <label className='label'>Auktion:</label>
                                <span>{watcher.metadata.auction ? 'Ja' : 'Nej'}</span>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
                <footer className='mt-2 flex flex-col-reverse items-center justify-between sm:flex-row'>
                    <div className='w-full text-sm opacity-70 sm:w-auto'>
                        <label className='label'>Lades till:</label>
                        <span>{new Date(userWatcher.createdAt).toLocaleDateString('se-SV')}</span>
                    </div>
                    <div className='flex w-full justify-end space-x-2 sm:w-auto sm:justify-start'>
                        <Button
                            onClick={handleSearchButtonClick}
                            label='Sök på min bevakning'
                            data-testid='watcherSearchButton'
                            variant='text'
                        />
                        <RemoveButton watcherId={userWatcher.id} />

                        <ExpandButton handleExpand={handleExpand} expand={_expand} />
                    </div>
                </footer>
            </article>
            <AnimatePresence>
                {_expand && <NewItemsDrawer watcher={userWatcher} newItems={newItems || []} />}
            </AnimatePresence>
        </div>
    )
}

export default WatcherCard
