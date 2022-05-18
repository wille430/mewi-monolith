import { ReactNode, useState } from 'react'
import * as ReactLoader from 'react-loader-spinner'
import classNames from 'classnames'
import { HTMLMotionProps, motion, useAnimation, Variants } from 'framer-motion'
import styles from './index.module.scss'
import utilities from '../utilities.module.scss'
import { Override } from '../types'

const cx = classNames.bind(styles)

export type ButtonProps = Override<
    HTMLMotionProps<'button'>,
    {
        onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<any> | any
        label?: string
        variant?: 'text' | 'outlined' | 'contained'
        icon?: ReactNode
        defaultCasing?: boolean
        fullWidth?: boolean
        disabled?: boolean
        className?: string
        type?: 'button' | 'submit' | 'reset'
        color?: 'primary' | 'secondary' | 'error'
    }
>

export const Button = (props: ButtonProps) => {
    const {
        onClick,
        children,
        label,
        variant = 'contained',
        icon,
        defaultCasing,
        fullWidth,
        disabled,
        className,
        color = 'primary',
        ...rest
    } = props
    const [isLoading, setLoading] = useState(false)
    const [tapPos, setTapPos] = useState({ x: 0, y: 0 })
    const rippleController = useAnimation()

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
            className={cx({
                [styles[`button--${variant}${isLoading || disabled ? '--disabled' : ''}`]]: true,
                [styles[color]]: true,
                [className || '']: true,
            })}
            data-testid='button'
            variants={buttonVariants}
            initial='initial'
            whileHover='hover'
            whileTap='tap'
            onClick={handleClick}
            onTapStart={(e: MouseEvent) => {
                setTapPos({
                    x: e.offsetX,
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
                animate={rippleController}
            />
            <div className='flex flex-row items-center justify-center w-full'>
                {icon && <div className={styles.icon}>
                    {icon}
                </div>}
                <div
                    className={cx({
                        [utilities['stack']]: true,
                        [utilities['center']]: true,
                        'flex-grow': true
                    })}
                >
                    <span className={utilities['hide']}>
                        {defaultCasing ? label : label?.toUpperCase()}
                    </span>
                    <span
                        className={cx({
                            [utilities['stackChild']]: true,
                            [utilities['hide']]: isLoading,
                            'pointer-events-none': true,
                            [styles.label]: true
                        })}
                    >
                        {defaultCasing ? label : label?.toUpperCase()}
                    </span>
                    <div
                        className={cx({
                            [utilities['stackChild']]: true,
                            [utilities['hide']]: !isLoading,
                        })}
                    >
                        <ReactLoader.TailSpin color='white' height='1rem' width='1rem' />
                    </div>
                </div>
            </div>
        </motion.button>
    )
}
