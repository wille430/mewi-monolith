import { IUserWatcher, ListingSearchFilters } from '@mewi/common/types'
import { Error } from '@mewi/common'
import { Button } from '@mewi/ui'
import CreateWatcherConfirmationModal from './CreateWatcherConfirmationModal'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { useState } from 'react'
import classNames from 'classnames'

const cx = classNames.bind({})

type Props = {
    searchFilters: ListingSearchFilters
    onClick?: () => void
}

const AddWatcherButton = ({ searchFilters, onClick, ...rest }: Props) => {
    const [showModal, setShowModal] = useState(false)
    const queryClient = useQueryClient()

    const mutation = useMutation(
        async (newWatcher: ListingSearchFilters) => {
            return axios
                .post<IUserWatcher>('/users/me/watchers', { metadata: newWatcher })
                .then((res) => res.data)
        },
        {
            onError: (error: any, variables, context) => {
                console.log({error})
                switch (error.code) {
                    case Error.Watcher.INVALID_QUERY:
                        error = 'Felaktigt filter'
                        break
                    case Error.Database.CONFLICTING_RESOURCE:
                        error = 'En bevakning med samma sökning finns redan'
                        break
                    default:
                        error = 'Ett fel inträffade'
                }

                return error
            },
            onSuccess: (data, variables, context) => {
                setShowModal(false)
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
                    {() => {
                        if (!mutation.error) {
                            return ''
                        }

                        switch ((mutation.error as any).code) {
                            case Error.Watcher.INVALID_QUERY:
                                return 'Felaktigt filter'
                            case Error.Database.CONFLICTING_RESOURCE:
                                return 'En bevakning med samma sökning finns redan'
                            default:
                                return 'Ett fel inträffade'
                        }
                    }}
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
