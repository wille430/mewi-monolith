import { SearchFilterDataProps } from '@mewi/types'
import { ButtonHTMLAttributes } from 'react'
import { Button } from '@mewi/ui'
import { useDispatch } from 'react-redux'
import { createWatcher } from 'store/watchers/creators'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    searchFilters: SearchFilterDataProps
    onClick?: () => void
}

const AddWatcherButton = ({ searchFilters, onClick, ...rest }: Props) => {
    const dispatch = useDispatch()

    // Add watcher
    const handleClick = async () => {
        dispatch(createWatcher(searchFilters))
    }

    return <Button {...rest} onClick={handleClick} label={'Lägg till bevakning'} defaultCasing />
}

export default AddWatcherButton
