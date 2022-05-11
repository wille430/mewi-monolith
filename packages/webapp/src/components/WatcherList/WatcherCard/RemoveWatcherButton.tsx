import { FiTrash } from 'react-icons/fi'
import { Button } from '@mewi/ui'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { PopulatedUserWatcher } from '@wille430/common'

const RemoveWatcherButton = ({ watcherId }: { watcherId: string }) => {
    const queryClient = useQueryClient()
    const mutation = useMutation(
        async () => await axios.delete(`/users/me/watchers/${watcherId}`),
        {
            onSuccess: async () =>
                queryClient.setQueryData('watchers', (old: PopulatedUserWatcher[]) =>
                    old.filter((x) => x.id !== watcherId)
                ),
        }
    )

    return (
        <Button
            data-testid='removeWatcherButton'
            onClick={async () => mutation.mutate()}
            color='error'
            icon={<FiTrash color='white' />}
        />
    )
}

export default RemoveWatcherButton
