import { FiTrash } from 'react-icons/fi'
import { Button } from '@mewi/ui'
import { useMutation, useQueryClient } from 'react-query'
import { instance } from '@/lib/axios'

const RemoveWatcherButton = ({ watcherId }: { watcherId: string }) => {
    const queryClient = useQueryClient()
    const mutation = useMutation(
        async () => await instance.delete(`/users/me/watchers/${watcherId}`),
        {
            onSuccess: async () =>
                queryClient.setQueryData('watchers', (old: any) =>
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
