import { FiTrash } from 'react-icons/fi'
import { Button } from '@/lib/components/Button/Button'
import { useSWRConfig } from 'swr'
import { removeUserWatcher } from '@/lib/client/user-watchers/mutations'

const RemoveWatcherButton = ({ watcherId }: { watcherId: string }) => {
    const { mutate } = useSWRConfig()
    return (
        <Button
            data-testid='removeWatcherButton'
            onClick={async () => mutate(...removeUserWatcher(watcherId))}
            color='error'
            icon={<FiTrash color='white' />}
        />
    )
}

export default RemoveWatcherButton
