import { DetailedHTMLProps, HTMLAttributes } from 'react'
import styles from './index.module.scss'
import classNames from 'classnames'

const cx = classNames.bind(styles)

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const Container = ({ className, children, ...rest }: ContainerProps) => {
    return (
        <section className={`${styles['container']} ${className || ''}`} {...rest}>
            {children}
        </section>
    )
}

export const ContainerHeader = (
    props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
) => (
    <header
        className={cx({
            [styles['header']]: true,
        })}
        {...props}
    >
        {props.children}
    </header>
)

export const ContainerContent = (
    props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
) => (
    <section
        className={cx({
            [styles['content']]: true,
        })}
        {...props}
    >
        {props.children}
    </section>
)

export const ContainerFooter = (
    props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
) => (
    <footer
        className={cx({
            [styles['footer']]: true,
        })}
        {...props}
    >
        {props.children}
    </footer>
)
