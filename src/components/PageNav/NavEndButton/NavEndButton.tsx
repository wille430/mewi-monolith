import clsx from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'
import styles from './NavEndButton.module.scss'

const NavEndButton = ({
    onClick,
    className,
    icon,
    ...rest
}: HTMLAttributes<HTMLButtonElement> & { icon: ReactNode }) => {
    return (
        <button className={clsx(styles.button, className)} onClick={onClick} {...rest}>
            {icon}
        </button>
    )
}

export default NavEndButton
