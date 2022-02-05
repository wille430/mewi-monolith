import react from 'react'
import React, { DetailedHTMLProps, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { Override } from '../types'
import styles from './index.module.scss'
import classNames from 'classnames'

const cx = classNames.bind(styles)

type InputProps = Override<
    DetailedHTMLProps<react.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    {
        showClearButton?: boolean
        onReset?: () => void
        value?: string
        onChange?: (value: string) => void
        fullWidth?: boolean
    }
>

export const TextField = ({
    onChange,
    className,
    onReset,
    placeholder,
    showClearButton,
    value,
    fullWidth,
    type,
    ...rest
}: InputProps) => {
    const [isActive, setIsActive] = useState(false)

    const ClearButton = () => {
        const handleClick = () => {
            onChange && onChange('')
            onReset && onReset()
        }

        if (showClearButton) {
            return (
                <button
                    type='reset'
                    className={styles['clearButton']}
                    data-testid='clearTextFieldButton'
                    onClick={handleClick}
                >
                    <FiX />
                </button>
            )
        } else {
            return null
        }
    }

    const Label = () => {
        return (
            <header
                className={cx({
                    [styles['header']]: true,
                    [styles['isActive']]: value || isActive,
                })}
            >
                <label
                    className={cx({
                        [styles['label']]: true,
                        [styles['isActive']]: value || isActive,
                    })}
                >
                    {placeholder}
                </label>
                <hr />
            </header>
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(e.currentTarget.value)
    }

    const handleFocus = () => {
        setIsActive(true)
    }

    const handleBlur = () => {
        setIsActive(false)
    }

    return (
        <div
            className={cx({
                [styles['container']]: true,
                [styles['isActive']]: value || isActive,
                [styles['fullWidth']]: fullWidth,
                [styles['hidden']]: type === 'hidden',
            })}
        >
            <Label />
            <input
                {...rest}
                className={`${styles['input']} ${className}`}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={value}
                type={type}
            />
            <ClearButton />
        </div>
    )
}
