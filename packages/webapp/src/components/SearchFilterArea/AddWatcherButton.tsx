import { SearchFilterDataProps } from '@mewi/common/types'
import { Error } from '@mewi/common'
import { Button } from '@mewi/ui'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { useEffect, useState } from 'react'
import { createWatcher } from 'store/watchers/creators'
import cx from 'classnames'
import CreateWatcherConfirmationModal from './CreateWatcherConfirmationModal'

type Props = {
    searchFilters: SearchFilterDataProps
    onClick?: () => void
}

const AddWatcherButton = ({ searchFilters, onClick, ...rest }: Props) => {
    const dispatch = useAppDispatch()
    const [response, setResponse] = useState('')
    const [error, setError] = useState('')
    const search = useAppSelector((state) => state.search)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        setError('')
        setResponse('')
    }, [search])

    // Add watcher
    const submit = async () => {
        onClick && onClick()
        setShowModal(false)

        setResponse('')
        setError('')

        dispatch(createWatcher(searchFilters))
            .unwrap()
            .then((action) => {
                console.log(action)
                setResponse('Bevakningen lades till')
            })
            .catch((e) => {
                switch (e.error?.type) {
                    case Error.Watcher.INVALID_QUERY:
                        setError('Felaktigt filter')
                        break
                    case Error.Watcher.CONFLICTING_RESOURCE:
                        setError('En bevakning med samma sökning finns redan')
                        break
                    default:
                        setError('Ett fel inträffade')
                }
            })
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
                        'text-secondary': response,
                        'text-red-400': error,
                        'ml-4': true,
                    })}
                >
                    {response || error}
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
