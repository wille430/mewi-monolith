import { HTMLAttributes } from 'react'
import styles from './index.module.scss'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {

}

const Container = ({ className, children, ...rest }: ContainerProps) => {
    return (
        <section
            className={`${styles.container} ${className || ''}`}
            {...rest}
        >
            {children}
        </section>
    )
}

export default Container