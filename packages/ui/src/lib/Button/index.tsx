import { HTMLAttributes, ReactNode, useState } from 'react'
import Loader from 'react-loader-spinner'
import styles from './index.module.scss'
import utilities from '../utilities.module.scss'
import classNames from 'classnames'
import { Override } from '../types'

const cx = classNames.bind(styles)

type ButtonProps = Override<
    HTMLAttributes<HTMLButtonElement>,
    {
        onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void
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

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (onClick) {
            setLoading(true)
            await onClick(e)
            setLoading(false)
        }
    }

    return (
        <button
            className={cx({
                [styles[`button--${variant}${isLoading || disabled ? '--disabled' : ''}`]]: true,
                [styles[color]]: true,
                [className || '']: true,
            })}
            data-testid='button'
            onClick={handleClick}
            {...rest}
        >
            <div className='flex flex-row items-center justify-center'>
                {icon}
                <div
                    className={cx({
                        [utilities['stack']]: true,
                        [utilities['center']]: true,
                    })}
                >
                    <span className={utilities['hide']}>
                        {defaultCasing ? label : label?.toUpperCase()}
                    </span>
                    <span
                        className={cx({
                            [utilities['stackChild']]: true,
                            [utilities['hide']]: isLoading,
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
                        <Loader type='TailSpin' color='white' height='1rem' width='1rem' />
                    </div>
                </div>
            </div>
        </button>
    )
}
