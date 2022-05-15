import { Button, ButtonProps } from '@mewi/ui'
import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { PopUpModal } from '../PopUpModal/PopUpModal'
import { pushToSnackbar } from '@/store/snackbar'
import { ListingSearchFilters, PopulatedUserWatcher } from '@wille430/common'
import { useRouter } from 'next/router'

type CreateWatcherButtonProps = ButtonProps & {
    error?: string
    setError: (value: string) => void
    onSuccess?: () => void
    onError?: () => void
    filters: ListingSearchFilters
}

export const CreateWatcherButton = ({
    error,
    setError,
    onSuccess,
    onError,
    filters,
    ...rest
}: CreateWatcherButtonProps) => {
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()
    const { isLoggedIn } = useAppSelector((state) => state.user)

    const mutation = useMutation(
        async (newWatcher: ListingSearchFilters) => {
            return axios
                .post<PopulatedUserWatcher>('/users/me/watchers', { metadata: newWatcher })
                .then((res) => res.data)
        },
        {
            onMutate: () => {
                console.log('Creating watcher from filters', filters)
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
                onError()
            },
            onSuccess: (data) => {
                onSuccess && onSuccess()
                setShowModal(false)
                dispatch(pushToSnackbar({ title: 'Bevakningar lades till!' }))

                queryClient.setQueryData('watchers', (old?: PopulatedUserWatcher[]) => [
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