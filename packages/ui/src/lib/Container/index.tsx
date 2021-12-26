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

const Header = (
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

const Content = (
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

const Footer = (
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

Container.Header = Header
Container.Content = Content
Container.Footer = Footer