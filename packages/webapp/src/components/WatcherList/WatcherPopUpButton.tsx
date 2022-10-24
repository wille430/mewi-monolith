import type { ButtonProps } from '@wille430/ui'
import { Button } from '@wille430/ui'
import { useState } from 'react'
import AddWatcherPopUp from './AddWatcherPopUp'

const WatcherPopUpButton = (props: ButtonProps) => {
    const [show, setShow] = useState(false)

    const handleClick = () => {
        setShow(true)
    }

    return (
        <>
            <AddWatcherPopUp useShow={{ show, setShow }} />
            <Button onClick={handleClick} label='Skapa bevakning' {...props} />
        </>
    )
}

export default WatcherPopUpButton
