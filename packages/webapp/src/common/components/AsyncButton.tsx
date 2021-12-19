import { ButtonHTMLAttributes, MouseEvent, ReactNode, useState } from "react"
import Loader from "react-loader-spinner"

export type AsyncButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode
}

const AsyncButton = ({ children, onClick, ...props }: AsyncButtonProps) => {

    const [loading, setLoading] = useState(false)

    const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setLoading(true)

        if (onClick) {
            await onClick(e)
        }

        setLoading(false)
    }

    return (
        <button onClick={handleClick} {...props}>
            {loading ? <div>
                <Loader
                    type="TailSpin"
                    height="15px"
                    width="15px"
                    color="white"
                />
            </div> : children}
        </button>
    )
}

export default AsyncButton