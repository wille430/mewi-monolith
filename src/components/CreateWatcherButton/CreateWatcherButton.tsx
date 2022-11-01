import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import type { ListingSearchFilters, IUserWatcher } from '@/common/schemas'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import type { PopUpModalProps } from '../PopUpModal/PopUpModal'
import { Button, ButtonProps } from '../Button/Button'
import { client } from '@/lib/client'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { pushToSnackbar } from '@/store/snackbar'

const PopUpModal = dynamic<PopUpModalProps>(
    () => import('../PopUpModal/PopUpModal').then((mod) => mod.PopUpModal),
    { loading: () => null }
)

type CreateWatcherButtonProps = ButtonProps & {
    error?: string
    setError: (value: string) => void
    onSuccess?: () => void
    onError?: () => void
    filters: ListingSearchFilters
}

export const CreateWatcherButton = ({
    setError,
    onSuccess,
    onError,
    filters,
    ...rest
}: CreateWatcherButtonProps) => {
    const [showModal, setShowModal] = useState(false)

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()
    const { isLoggedIn } = useAppSelector((state) => state.user)
    const router = useRouter()

    const mutation = useMutation(
        async (newWatcher: ListingSearchFilters) => {
            return client
                .post<IUserWatcher>('/user-watchers', { metadata: newWatcher })
                .then((res) => res.data)
        },
        {
            onMutate: () => {
                setError('')
            },
            onError: (error: any) => {
                switch (error.status) {
                    case 422:
                    case 400:
                        error = 'Felaktigt filter'
                        break
                    case 409:
                        error = 'En bevakning med samma sökning finns redan'
                        break
                    default:
                        error = 'Ett fel inträffade'
                }

                setError(error)
                setShowModal(false)
                onError && onError()
            },
            onSuccess: (data) => {
                onSuccess && onSuccess()
                setShowModal(false)
                dispatch(pushToSnackbar({ title: 'Bevakningar lades till!' }))

                queryClient.setQueryData('watchers', (old?: IUserWatcher[]) => [
                    ...(old ?? []),
                    data,
                ])
            },
        }
    )

    return (
        <>
            <Button
                label='Lägg till bevakning'
                color='primary'
                onClick={() => {
                    if (isLoggedIn) {
                        setShowModal(true)
                    } else {
                        router.push('/loggain')
                    }
                }}
                disabled={mutation.isLoading}
                data-testid='addWatcherButton'
                {...rest}
            />
            <PopUpModal
                heading='Är du säker att du vill lägga en bevakning på sökningen?'
                bodyText='Genom att klicka på "Ja" godkänner du att ta emot e-post varje gång det kommer nya föremål som matchar din sökning.'
                onExit={() => setShowModal(false)}
                open={showModal}
                onAccept={() => mutation.mutate(filters)}
            />
        </>
    )
}
