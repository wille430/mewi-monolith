import WatcherCard from './WatcherCard';
import UserAPI from 'api/UserAPI';
import { UserContext } from 'common/context/UserContext';
import * as React from 'react';
import StyledLoader from 'common/components/StyledLoader';
import WatcherPopUpButton from './WatcherPopUpButton';
import { WatcherContext } from './WatcherContext';
import { Link } from 'react-router-dom';



const WatcherList = () => {

    const [loading, setLoading] = React.useState(false)
    const { token } = React.useContext(UserContext)
    const { watchers, dispatch } = React.useContext(WatcherContext)

    const renderItems = () => {
        if (loading) {
            return (
                <div className="flex-grow flex justify-center items-center">
                    <div className="h-32">
                        <StyledLoader />
                    </div>
                </div >
            )
        } else {
            if (watchers.length > 0) {
                return (
                    <div className="w-full grid space-y-8">
                        {watchers.map((watcherObj, i) => (
                            watcherObj && <WatcherCard
                                key={i}
                                watcher={watcherObj}
                            />
                        ))}
                    </div>
                )
            } else {
                return (
                    <div className="flex-grow flex justify-center items-center">
                        <div className="h-32">
                            <span className="text-white text-sm">Du har inga bevakningar ännu</span>
                        </div>
                    </div>
                )
            }
        }
    }

    React.useEffect(() => {
        const fetchWatchers = async () => {
            try {
                setLoading(true)

                const watcherObjs = await UserAPI.getWatchers(token)
                
                dispatch({ type: 'replaceAll', newWatchers: watcherObjs })

                setLoading(false)
            } catch (e) {
                setLoading(false)
            }
        }

        fetchWatchers()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section className="flex bg-blue rounded-lg mx-auto" style={{
            maxWidth: '875px',
            minHeight: '60vh'
        }}>
            <div className="flex flex-col items-center w-full p-6">
                <header className="pb-6">
                    <h1 className="text-2xl text-white pt-2">Mina bevakningar</h1>
                    <Link className="block w-full text-green-dark text-center" to="/premium">Uppgradera</Link>
                </header>
                <div className={"w-full flex flex-col space-y-2 flex-grow items-stretch"}>
                    {
                        renderItems()
                    }
                </div>
                <footer className="w-full flex justify-end mt-6">
                    <WatcherPopUpButton
                        data-testid="createNewWatcherButton"
                    />
                </footer>
            </div >
        </section>
    )
}

export default WatcherList