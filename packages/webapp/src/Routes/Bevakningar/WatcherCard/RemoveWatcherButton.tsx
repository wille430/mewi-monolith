import AsyncButton from 'common/components/AsyncButton'
import { useContext } from 'react'
import { FiTrash } from 'react-icons/fi'
import { WatcherContext } from '../WatcherContext'

const RemoveWatcherButton = ({ watcherId }: { watcherId: string }) => {
    const { dispatch } = useContext(WatcherContext)

    return (
        <AsyncButton
            className='button bg-gray-400 hover:bg-red-400 flex justify-center items-center
            hover:scale-125
            active:bg-green'
            data-testid='removeWatcherButton'
            onClick={async () => {
                dispatch({ type: 'remove', id: watcherId })
            }}
        >
            <FiTrash color='white' />
        </AsyncButton>
    )
}

export default RemoveWatcherButton
