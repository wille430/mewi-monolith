import { useContext } from 'react'
import { FiTrash } from 'react-icons/fi'
import { WatcherContext } from '../WatcherContext'
import Button from 'common/components/Button'

const RemoveWatcherButton = ({ watcherId }: { watcherId: string }) => {
    const { dispatch } = useContext(WatcherContext)

    return (
        <Button
            className='bg-red-400 hover:bg-red-300'
            data-testid='removeWatcherButton'
            onClick={async () => {
                dispatch({ type: 'remove', id: watcherId })
            }}
            icon={<FiTrash color='white' />}
        />
    )
}

export default RemoveWatcherButton
