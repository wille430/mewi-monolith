import { HTMLAttributes } from 'react'
import styles from './index.module.scss'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {

}

const Container = ({ className, children, ...rest }: ContainerProps) => {
    return (
        <div
            className={`${styles.container} ${className}`}
            {...rest}
        >
            {children}
        </div>
    )
}

export default Container