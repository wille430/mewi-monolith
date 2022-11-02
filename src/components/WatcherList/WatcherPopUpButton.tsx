import { useState } from 'react'
import AddWatcherPopUp from './AddWatcherPopUp'
import { Button, ButtonProps } from '../Button/Button'

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
