import queryString from 'query-string'
import type {Dispatch} from 'react'
import {useEffect, useRef, useState} from 'react'
import {AnimatePresence} from 'framer-motion'
import {useRouter} from 'next/router'
import omit from 'lodash/omit'
import styles from './WatcherCard.module.scss'
import NewItemsDrawer from './NewItemsDrawer/NewItemsDrawer'
import RemoveButton from './RemoveWatcherButton'
import ExpandButton from './ExpandButton/ExpandButton'
import {Button} from '@/lib/components/Button/Button'
import {CategoryLabel, UserWatcherDto} from "@mewi/models"

const WatcherCard = ({
                         userWatcher,
                         expand,
                         onExpand,
                     }: {
    userWatcher: UserWatcherDto
    expand?: boolean
    onExpand?: Dispatch<boolean>
}) => {
    const [_expand, _setExpand] = expand && onExpand ? [expand, onExpand] : useState(false)
    const {watcher} = userWatcher

    const scrollRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const handleSearchButtonClick = async () => {
        const filters = omit(watcher.metadata, ['category'])
        const pathname = '/sok'

        await router.push({
            pathname,
            search: queryString.stringify(filters),
        })
    }

    const handleExpand = () => {
        _setExpand(!_expand)
    }

    const regionsString = () => {
        if (typeof watcher.metadata.region === 'string') return watcher.metadata.region

        return watcher.metadata.region
    }

    useEffect(() => {
        if (_expand) scrollRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
    }, [_expand])

    return (
        <div className={styles.watcherCardContainer} ref={scrollRef}>
            <article
                className="flex flex-col rounded-md border-2 bg-white p-4 shadow-sm"
                data-testid="watcherCard"
            >
                {watcher.metadata.keyword && (
                    <header className="mb-4 flex-none">
                        <label className="label">Sökord:</label>
                        <span>{watcher.metadata.keyword}</span>
                    </header>
                )}
                <div className="flex flex-grow space-y-4">
                    <div className="grid flex-1 grid-cols-fit-12 gap-4">
                        {watcher.metadata.region && watcher.metadata.region.length >= 1 ? (
                            <div className="mr-6">
                                <label className="label">Regioner:</label>
                                <span>{regionsString()}</span>
                            </div>
                        ) : (
                            <div></div>
                        )}

                        {watcher.metadata.categories ? (
                            <div className="mr-6">
                                <label className="label">
                                    {watcher.metadata.categories.length > 1
                                        ? 'Kategori:'
                                        : 'Kategorier:'}
                                </label>
                                {watcher.metadata.categories.map((cat) => (
                                    <span key={cat} className="mr-2">
                                        {CategoryLabel[cat]}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div></div>
                        )}
                        {watcher.metadata.priceRangeGte || watcher.metadata.priceRangeLte ? (
                            <div className="mr-6">
                                <label className="label">Prisintervall:</label>
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
                            <div className="mr-6">
                                <label className="label">Auktion:</label>
                                <span>{watcher.metadata.auction ? 'Ja' : 'Nej'}</span>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
                <footer className="mt-2 flex flex-col-reverse items-center justify-between sm:flex-row">
                    <div className="w-full text-sm opacity-70 sm:w-auto">
                        <label className="label">Lades till:</label>
                        <span>{new Date(userWatcher.createdAt).toLocaleDateString('se-SV')}</span>
                    </div>
                    <div className="flex w-full justify-end space-x-2 sm:w-auto sm:justify-start">
                        <Button
                            onClick={handleSearchButtonClick}
                            label="Sök på min bevakning"
                            data-testid="watcherSearchButton"
                            variant="text"
                        />
                        <RemoveButton watcherId={userWatcher.id}/>

                        <ExpandButton handleExpand={handleExpand} expand={_expand}/>
                    </div>
                </footer>
            </article>
            <AnimatePresence>{_expand && <NewItemsDrawer watcher={userWatcher}/>}</AnimatePresence>
        </div>
    )
}

export default WatcherCard
