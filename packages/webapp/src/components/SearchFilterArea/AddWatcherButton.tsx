import { IUserWatcher, ListingSearchFilters } from '@wille430/common'
import { Button } from '@mewi/ui'
import CreateWatcherConfirmationModal from './CreateWatcherConfirmationModal'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { useState } from 'react'
import classNames from 'classnames'
import { useAppDispatch } from 'hooks/hooks'
import { pushToSnackbar } from 'store/snackbar/creators'

const cx = classNames.bind({})

type Props = {
    searchFilters: ListingSearchFilters
    onClick?: () => void
}

const AddWatcherButton = ({ searchFilters, onClick, ...rest }: Props) => {
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState('')
    const queryClient = useQueryClient()
    const dispatch = useAppDispatch()

    const mutation = useMutation(
        async (newWatcher: ListingSearchFilters) => {
            return axios
                .post<IUserWatcher>('/users/me/watchers', { metadata: newWatcher })
                .then((res) => res.data)
        },
        {
            onMutate: () => setError(''),
            onError: (error: any, variables, context) => {
                switch (error.statusCode) {
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
            },
            onSuccess: (data, variables, context) => {
                setShowModal(false)
                dispatch(pushToSnackbar({ title: 'Bevakningar lades till!' }))
                queryClient.setQueryData('watchers', (old: IUserWatcher[]) => [...old, data])
            },
        }
    )

    // Add watcher
    const submit = async () => {
        onClick && onClick()
        mutation.mutate(searchFilters)
    }

    const handleClick = () => {
        setShowModal(true)
    }

    return (
        <>
            <div>
                <Button
                    {...rest}
                    onClick={handleClick}
                    label={'Lägg till bevakning'}
                    defaultCasing
                />
                <span
                    className={cx({
                        'text-red-400': mutation.error,
                        'ml-4': true,
                    })}
                >
                    {error}
                </span>
            </div>
            <CreateWatcherConfirmationModal
                open={showModal}
                onExit={() => setShowModal(false)}
                onAccept={submit}
            />
        </>
    )
}

export default AddWatcherButton
