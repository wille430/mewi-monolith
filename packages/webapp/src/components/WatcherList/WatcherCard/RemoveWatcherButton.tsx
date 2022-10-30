import { FiTrash } from 'react-icons/fi'
import { Button } from '@wille430/ui'
import { useMutation, useQueryClient } from 'react-query'
import { client } from '@/lib/client'

const RemoveWatcherButton = ({ watcherId }: { watcherId: string }) => {
    const queryClient = useQueryClient()
    const mutation = useMutation(async () => await client.delete(`/user-watchers/${watcherId}`), {
        onSuccess: async () =>
            queryClient.setQueryData('watchers', (old: any) =>
                old.filter((x) => x.id !== watcherId)
            ),
    })

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
