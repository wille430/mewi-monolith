import { FiTrash } from 'react-icons/fi'
import { Button } from '@mewi/ui'
import { useDispatch } from 'react-redux'
import { removeWatcher } from 'store/watchers/creators'

const RemoveWatcherButton = ({ watcherId }: { watcherId: string }) => {
    const dispatch = useDispatch()

    return (
        <Button
            className='bg-red-400 hover:bg-red-300'
            data-testid='removeWatcherButton'
            onClick={async () => {
                dispatch(removeWatcher(watcherId))
            }}
            icon={<FiTrash color='white' />}
        />
    )
}

export default RemoveWatcherButton
