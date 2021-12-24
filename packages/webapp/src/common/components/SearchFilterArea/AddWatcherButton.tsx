import {
    APIResponseError,
    DatabaseErrorCodes,
    SearchFilterDataProps,
} from '@mewi/types'
import { ButtonHTMLAttributes, useContext, useEffect, useState } from 'react'
import { WatcherContext } from 'Routes/Bevakningar/WatcherContext'
import Button from 'common/components/Button'
import { SnackbarContext } from 'common/context/SnackbarContext'
import { createWatcher } from 'api/'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    searchFilters: SearchFilterDataProps
    onClick?: () => void
}

const AddWatcherButton = ({ searchFilters, onClick, ...rest }: Props) => {
    const { setSnackbar } = useContext(SnackbarContext)
    const { dispatch } = useContext(WatcherContext)

    const initState = {
        msg: null,
        color: 'text-red-400',
    }
    const [responseMsg, setResponseMsg] = useState<any>(initState)

    useEffect(() => {
        // Hide message when user clicks
        document
            .getElementById('root')
            ?.addEventListener('click', () => responseMsg.msg !== null && setResponseMsg(initState))
    }, [])

    // Add watcher
    const handleClick = async () => {
        createWatcher(searchFilters)
            .then((newWatcher) => {
                dispatch({ type: 'add', newWatcher: newWatcher })
                setSnackbar({
                    title: 'Bevaknigen lades till',
                    body: 'Du kommer få notiser på mejlen när nya föremål läggs till som stämmer överens med bevakningens filter',
                })
                onClick && onClick()
            })
            .catch((e: APIResponseError) => {
                switch (e.error.type) {
                    case DatabaseErrorCodes.CONFLICTING_RESOURCE:
                        setResponseMsg({
                            msg: 'En bevakning med samma sökning existerar redan',
                            color: 'text-red-400',
                        })
                        break
                    default:
                        setResponseMsg({
                            msg: 'Ett fel inträffade',
                            color: 'text-red-400',
                        })
                }
            })
    }

    return (
        <div>
            <Button {...rest} onClick={handleClick} label={'Lägg till'} />
            <span className={'text-sm pl-2 ' + responseMsg.color}>{responseMsg.msg}</span>
        </div>
    )
}

export default AddWatcherButton
