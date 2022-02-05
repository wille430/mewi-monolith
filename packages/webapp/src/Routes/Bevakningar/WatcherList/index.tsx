import WatcherCard from './WatcherCard'
import * as React from 'react'
import StyledLoader from 'components/StyledLoader'
import WatcherPopUpButton from './WatcherPopUpButton'
import { getAllWatchers } from 'store/watchers/creators'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'hooks/hooks'
import { useEffect } from 'react'

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
                    <div className='grid w-full space-y-8'>
                        {watchers.map(
                            (watcherObj, i) =>
                                watcherObj && <WatcherCard key={i} watcher={watcherObj} />
                        )}
                    </div>
                )
            } else {
                return (
                    <div className='flex flex-grow items-center justify-center'>
                        <div className='h-32'>
                            <span className='text-sm text-white'>Du har inga bevakningar ännu</span>
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
        <section
            className='mx-auto flex rounded-lg bg-blue'
            style={{
                maxWidth: '875px',
                minHeight: '60vh',
            }}
        >
            <div className='flex w-full flex-col items-center p-6'>
                <header className='pb-6'>
                    <h3 className='text-white'>Mina bevakningar</h3>
                </header>
                <div className={'flex w-full flex-grow flex-col items-stretch space-y-2'}>
                    {renderItems()}
                </div>
                <footer className='mt-6 flex w-full justify-end'>
                    <WatcherPopUpButton data-testid='createNewWatcherButton' />
                </footer>
            </div>
        </section>
    )
}

export default WatcherList
