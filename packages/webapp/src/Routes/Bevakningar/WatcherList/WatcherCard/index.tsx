import { useHistory } from 'react-router-dom'
import { capitalize } from '@mewi/util'
import RemoveButton from './RemoveWatcherButton'
import { PublicWatcher } from '@mewi/types'
import { Button } from '@mewi/ui'
import queryString from 'query-string'

const WatcherCard = ({ watcher }: { watcher: PublicWatcher }) => {
    const history = useHistory()

    const handleSearchButtonClick = () => {
        history.push({
            pathname: '/search',
            search: queryString.stringify(watcher.metadata),
        })
    }

    const regionsString = () => {
        if (typeof watcher.metadata.regions === 'string') return watcher.metadata.regions

        return watcher.metadata.regions?.map((x: string) => capitalize(x)).join(', ')
    }

    return (
        <article
            className='shadow-md rounded-md bg-white p-4 flex flex-col'
            data-testid='watcherCard'
        >
            {watcher.metadata.keyword && (
                <header className='flex-none mb-4'>
                    <label className='label'>Sökord:</label>
                    <span>{watcher.metadata.keyword}</span>
                </header>
            )}
            <div className='flex flex-grow space-y-4'>
                <div className='grid grid-cols-fit-12 flex-1 gap-4'>
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
                            <span>{capitalize(watcher.metadata.category)}</span>
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
            <footer className='flex items-center justify-between mt-2'>
                <div className='text-sm opacity-70'>
                    <label className='label'>Lades till:</label>
                    <span>{new Date(watcher.createdAt).toLocaleDateString('se-SV')}</span>
                </div>
                <div className='flex space-x-2'>
                    <Button
                        onClick={handleSearchButtonClick}
                        label='Sök på min bevakning'
                        data-testid='watcherSearchButton'
                        variant='text'
                    />
                    <RemoveButton watcherId={watcher._id.toString()} />
                </div>
            </footer>
        </article>
    )
}

export default WatcherCard
