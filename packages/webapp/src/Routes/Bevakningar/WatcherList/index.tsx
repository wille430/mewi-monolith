import WatcherCard from './WatcherCard'
import * as React from 'react'
import StyledLoader from 'common/components/StyledLoader'
import WatcherPopUpButton from './WatcherPopUpButton'
import { getAllWatchers } from 'store/watchers/creators'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'common/hooks/hooks'
import { useEffect } from 'react'

const WatcherList = () => {
    const { isLoading, watchers } = useAppSelector((state) => state.watchers)

    const dispatch = useDispatch()

    const renderItems = () => {
        if (isLoading) {
            return (
                <div className='flex-grow flex justify-center items-center'>
                    <div className='h-32'>
                        <StyledLoader />
                    </div>
                </div>
            )
        } else {
            if (watchers.length > 0) {
                return (
                    <div className='w-full grid space-y-8'>
                        {watchers.map(
                            (watcherObj, i) =>
                                watcherObj && <WatcherCard key={i} watcher={watcherObj} />
                        )}
                    </div>
                )
            } else {
                return (
                    <div className='flex-grow flex justify-center items-center'>
                        <div className='h-32'>
                            <span className='text-white text-sm'>Du har inga bevakningar ännu</span>
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
            className='flex bg-blue rounded-lg mx-auto'
            style={{
                maxWidth: '875px',
                minHeight: '60vh',
            }}
        >
            <div className='flex flex-col items-center w-full p-6'>
                <header className='pb-6'>
                    <h3 className='text-white'>Mina bevakningar</h3>
                </header>
                <div className={'w-full flex flex-col space-y-2 flex-grow items-stretch'}>
                    {renderItems()}
                </div>
                <footer className='w-full flex justify-end mt-6'>
                    <WatcherPopUpButton data-testid='createNewWatcherButton' />
                </footer>
            </div>
        </section>
    )
}

export default WatcherList
