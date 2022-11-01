import classNames from 'classnames'
import { TableHTMLAttributes } from 'react'
import styles from './Table.module.scss'

export const Table = ({ children, className, ...props }: TableHTMLAttributes<HTMLTableElement>) => {
    return (
        <table
            className={classNames({
                [styles.table]: true,
                [className ?? '']: className,
            })}
            {...props}
        >
            {children}
        </table>
    )
}
