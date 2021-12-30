import { Link, useHistory } from 'react-router-dom'
import { PriceRangeUtils } from 'utils'
import { capitalize } from '@mewi/util'
import RemoveButton from './RemoveWatcherButton'
import { PublicWatcher } from '@mewi/types'
import { Button } from '@mewi/ui'

const WatcherCard = ({ watcher }: { watcher: PublicWatcher }) => {
    const history = useHistory()

    const queryParams = [
        ['q', watcher.metadata.keyword],
        ['region', watcher.metadata.regions],
        ['category', watcher.metadata.category],
        ['isAuction', watcher.metadata.auction],
        ['price', PriceRangeUtils.toString(watcher.metadata.priceRange)],
    ]

    const linkUrl =
        '/search?' +
        queryParams
            .map((x) => {
                if (!x[1]) return ''
                return `${x[0]}=${x[1]}`
            })
            .filter((x) => x !== '')
            .join('&')

    const handleSearchButtonClick = () => {
        history.push(linkUrl)
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
                    {watcher.metadata.priceRange ? (
                        <div className='mr-6'>
                            <label className='label'>Prisintervall:</label>
                            <span>
                                {(watcher.metadata.priceRange.gte || '0') +
                                    '-' +
                                    (watcher.metadata.priceRange.lte
                                        ? watcher.metadata.priceRange.lte + 'kr'
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
                        label='Sök'
                        data-testid='watcherSearchButton'
                    />
                    <RemoveButton watcherId={watcher._id.toString()} />
                </div>
            </footer>
        </article>
    )
}

export default WatcherCard
