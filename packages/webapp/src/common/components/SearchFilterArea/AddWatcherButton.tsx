import {
    APIResponseError,
    DatabaseErrorCodes,
    SearchFilterDataProps,
    WatcherMetadata,
} from '@mewi/types'
import { ButtonHTMLAttributes, useContext, useState } from 'react'
import { WatcherContext } from 'Routes/Bevakningar/WatcherContext'
import AsyncButton from 'common/components/AsyncButton'
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

    // Hide message when user clicks
    document
        .getElementById('root')
        ?.addEventListener('click', () => responseMsg.msg !== null && setResponseMsg(initState))

    // Add watcher
    const handleClick = async () => {
        createWatcher(searchFilters)
            .then((newWatcher) => {
                dispatch({ type: 'add', newWatcher: newWatcher })
                onClick && onClick()
                setResponseMsg({
                    msg: 'Bevakningen lades till',
                    color: 'text-green-400'
                })
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
            <AsyncButton {...rest} onClick={handleClick}>
                <span>Bevaka sökning</span>
            </AsyncButton>
            <span className={'text-sm pl-2 ' + responseMsg.color}>{responseMsg.msg}</span>
        </div>
    )
}

export default AddWatcherButton
