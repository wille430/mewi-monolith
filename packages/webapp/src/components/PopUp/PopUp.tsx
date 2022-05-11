import { HTMLAttributes } from 'react'
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
}: HTMLAttributes<HTMLDivElement> & PopUpProps) => (
    <div
        {...props}
        onClick={(e) => {
            e.isPropagationStopped()
            onOutsideClick && onOutsideClick()
        }}
        className={classNames({
            ['absolute top-0 left-0 w-full h-screen']: true,
            ['hidden']: !show,
            [props.className]: Boolean(props.className),
        })}
    >
        {children}
    </div>
)
