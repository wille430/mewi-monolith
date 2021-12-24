import { useContext } from 'react'
import { FiTrash } from 'react-icons/fi'
import { WatcherContext } from '../WatcherContext'
import Button from 'common/components/Button'

const RemoveWatcherButton = ({ watcherId }: { watcherId: string }) => {
    const { dispatch } = useContext(WatcherContext)

    return (
        <Button
        
            data-testid='removeWatcherButton'
            onClick={async () => {
                dispatch({ type: 'remove', id: watcherId })
            }}
        >
            <FiTrash color='white' />
        </Button>
    )
}

export default RemoveWatcherButton
