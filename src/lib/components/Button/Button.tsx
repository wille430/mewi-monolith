import { ReactNode, useState, MouseEvent } from 'react'
import * as ReactLoader from 'react-loader-spinner'
import { HTMLMotionProps, motion, useAnimation, Variants } from 'framer-motion'
import styles from './Button.module.scss'
import utilities from '../../../styles/utilities.module.scss'
import clsx from 'clsx'

export type Variant = 'text' | 'outlined' | 'contained'

export type ButtonProps = HTMLMotionProps<'button'> & {
    onClick?: (e: MouseEvent) => Promise<any> | any
    label?: string
    variant?: Variant
    icon?: ReactNode
    defaultCasing?: boolean
    fullWidth?: boolean
    disabled?: boolean
    className?: string
    color?: 'primary' | 'secondary' | 'error' | string
    size?: 'sm' | 'md' | 'lg'
    children?: ReactNode
}

export const Button = (props: ButtonProps) => {
    const {
        onClick,
        children,
        label,
        variant = 'contained',
        icon,
        defaultCasing,
        fullWidth,
        className,
        color = 'primary',
        size = 'md',
        ...rest
    } = props
    const [isLoading, setLoading] = useState(false)
    const [tapPos, setTapPos] = useState({ x: 0, y: 0 })
    const rippleController = useAnimation()

    const handleClick = async (e: MouseEvent) => {
        if (onClick && !isLoading) {
            setLoading(true)
            await onClick(e)
            setLoading(false)
        }
    }

    const rippleVariants: Variants = {
        position: {
            ...tapPos,
        },
        ripple: {
            x: tapPos.x,
            y: tapPos.y,
            scale: [0, 5, 15],
            opacity: [0, 0.33, 0],
            transition: {
                duration: 0.75,
            },
        },
        hide: {
            scale: 0,
            opacity: 0,
            x: 0,
            y: 0,
            transition: {
                duration: 0.1,
                delay: 0.75,
            },
        },
    }

    const buttonVariants: Variants = {
        initial: {
            scale: 1.0,
        },
        hover: {
            scale: 1.01,
        },
        tap: {
            scale: 0.99,
        },
    }

    return (
        <motion.button
            className={clsx({
                [styles[`button--${variant}--${size}`]]: true,
                [styles[color]]: true,
                ['w-full']: fullWidth,
                [className || '']: true,
            })}
            data-testid='button'
            variants={buttonVariants}
            initial='initial'
            whileHover='hover'
            whileTap={rest.disabled ? undefined : 'tap'}
            onClick={handleClick}
            onTapStart={(e) => {
                setTapPos({
                    // @ts-ignore
                    x: e.offsetX,
                    // @ts-ignore
                    y: e.offsetY,
                })

                rippleController.set('position')
                rippleController.start('ripple')
            }}
            {...rest}
        >
            <motion.div
                className={styles.overlay}
                variants={{
                    initial: {
                        opacity: 0,
                    },
                    tap: {
                        opacity: [0, 0.33, 0.5],
                    },
                }}
            />
            <motion.div
                className={styles.touchRipples}
                variants={rippleVariants}
                initial='hide'
                animate={rest.disabled ? 'hide' : rippleController}
            />
            <div
                className={clsx({
                    [utilities['center']]: true,
                })}
            >
                {icon && <div className={styles.icon}>{icon}</div>}
                {label && (
                    <div
                        className={clsx({
                            [utilities['stack']]: true,
                            [utilities['center']]: true,
                            'ml-2 flex-grow': true,
                        })}
                    >
                        <span className={utilities['hide']}>
                            {defaultCasing ? label : label?.toUpperCase()}
                        </span>
                        <span
                            className={clsx({
                                [utilities['stackChild']]: true,
                                [utilities['hide']]: isLoading,
                                'pointer-events-none': true,
                                [styles.label]: true,
                            })}
                        >
                            {defaultCasing ? label : label?.toUpperCase()}
                        </span>
                        <div
                            className={clsx({
                                [utilities['stackChild']]: true,
                                [utilities['hide']]: !isLoading,
                            })}
                        >
                            <ReactLoader.TailSpin color='white' height={16} width='1rem' />
                        </div>
                    </div>
                )}
            </div>
        </motion.button>
    )
}
