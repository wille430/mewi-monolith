import { ButtonHTMLAttributes, useState } from "react"
import AddWatcherPopUp from "./AddWatcherPopUp"


const WatcherPopUpButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {

    const [show, setShow] = useState(false)

    const handleClick = () => {
        setShow(true)
    }

    return (
        <>
            <AddWatcherPopUp useShow={{show, setShow}}/>
            <button className="button" onClick={handleClick} {...props}>
                Skapa ny bevakning
            </button>
        </>
    )
}

export default WatcherPopUpButton