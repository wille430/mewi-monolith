import React from 'react'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import classNames from 'classnames'
import styles from './Container.module.scss'

export type ContainerProps = HTMLAttributes<HTMLDivElement>

export const Container = ({ className, children, ...rest }: ContainerProps) => (
    <section
        className={classNames({
            [styles['container']]: true,
            [className ?? '']: !!className,
        })}
        {...rest}
    >
        {children}
    </section>
)

const Header = (props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => (
    <header className={styles['header']} {...props}>
        {props.children}
    </header>
)

const Content = (props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => (
    <section className={styles['header']} {...props}>
        {props.children}
    </section>
)

const Footer = (props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => (
    <footer className={styles['footer']} {...props}>
        {props.children}
    </footer>
)

Container.Header = Header
Container.Content = Content
Container.Footer = Footer
