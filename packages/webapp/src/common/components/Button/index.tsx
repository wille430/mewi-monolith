import { HTMLAttributes, ReactNode, useState } from 'react'
import Loader from 'react-loader-spinner'
import { Override } from 'types/types'
import styles from './index.module.scss'

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
    const classNames = [styles['button--' + type]]

    console.log(styles)

    return (
        <button
            className={classNames.join(' ')}
            data-testid='button'
            onClick={handleClick}
            {...rest}
        >
            <div className='flex flex-row justify-center items-center space-x-2'>
                {icon}
                {!isLoading ? (
                    <span>{defaultCasing ? label : label?.toUpperCase()}</span>
                ) : (
                    <Loader type='TailSpin' color='white' />
                )}
            </div>
        </button>
    )
}

export default Button
