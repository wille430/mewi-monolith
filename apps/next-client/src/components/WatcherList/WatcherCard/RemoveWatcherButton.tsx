import {FiTrash} from 'react-icons/fi'
import {Button} from '@/components/Button/Button'
import {useSWRConfig} from 'swr'
import {removeUserWatcher} from '@/client/user-watchers/mutations'

const RemoveWatcherButton = ({watcherId}: { watcherId: string }) => {
    const {mutate} = useSWRConfig()
    return (
        <Button
            data-testid="removeWatcherButton"
            className="bg-error centered btn-sm"
            onClick={async () => mutate(...removeUserWatcher(watcherId))}
        >
            <FiTrash color="white"/>
        </Button>
    )
}

export default RemoveWatcherButton
