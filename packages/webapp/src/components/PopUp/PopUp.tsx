import { HTMLAttributes, useRef } from 'react'
import classNames from 'classnames'

interface PopUpProps {
    onOutsideClick?: () => void
    show?: boolean
}

export const PopUp = ({
    children,
    onOutsideClick,
    show = true,
    ...props
}: HTMLAttributes<HTMLDivElement> & PopUpProps) => {
    const popUpRef = useRef<HTMLDivElement | null>(null)

    return (
        <div
            {...props}
            ref={popUpRef}
            onClick={(e) => {
                e.isPropagationStopped()

                if (e.target === popUpRef.current) onOutsideClick && onOutsideClick()
            }}
            className={classNames({
                ['fixed top-0 left-0 w-full h-screen bg-black/25 z-20']: true,
                ['hidden']: !show,
                [props.className ?? '']: Boolean(props.className),
            })}
        >
            {children}
        </div>
    )
}
