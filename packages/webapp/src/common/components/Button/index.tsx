import { HTMLAttributes, ReactNode, useEffect, useState } from 'react'
import Loader from 'react-loader-spinner'
import { Override } from 'types/types'
import styles from './index.module.scss'
import utilities from '../utilities.module.scss'

type ButtonProps = Override<
    HTMLAttributes<HTMLButtonElement>,
    {
        onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void
        label?: string
        type?: 'text' | 'outlined' | 'contained'
        icon?: ReactNode
        defaultCasing?: boolean
        fullWidth?: boolean
        disabled?: boolean
    }
>

const Button = (props: ButtonProps) => {
    const {
        onClick,
        children,
        label,
        type = 'contained',
        icon,
        defaultCasing,
        fullWidth,
        disabled,
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

    // Styling
    let className = styles[`button--${type}${(isLoading || disabled) ? '--disabled' : ''}`]

    return (
        <button
            className={className}
            data-testid='button'
            onClick={handleClick}
            {...rest}
        >
            <div className='flex flex-row justify-center items-center space-x-2'>
                {icon}
                <div className={`${utilities.stack} ${utilities.center}`}>
                    <span className={utilities.hide}>{defaultCasing ? label : label?.toUpperCase()}</span>
                    <span className={`${utilities.stackChild} ${isLoading ? utilities.hide : ''}`}>{defaultCasing ? label : label?.toUpperCase()}</span>
                    <div className={`${utilities.stackChild} ${isLoading ? '' : utilities.hide}`}>
                        <Loader type='TailSpin' color='white' height="1rem" width="1rem" />
                    </div>
                </div>
            </div>
        </button>
    )
}

export default Button
