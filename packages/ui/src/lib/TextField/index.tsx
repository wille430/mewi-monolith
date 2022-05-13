import { ReactNode, useEffect } from 'react'
import React, { DetailedHTMLProps, useState } from 'react'
import { FiX } from 'react-icons/fi'
import styles from './index.module.scss'
import cx from 'classnames'
import { Override } from '../types'

export type TextFieldProps = Override<
    DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    {
        value: string
    }
> & {
    showClearButton?: boolean
    onReset?: () => void
    fullWidth?: boolean
    endComponent?: ReactNode[]
    showLabel?: boolean
} & {
    'data-testid'?: string
}

export const TextField = ({
    showClearButton,
    onReset,
    fullWidth,
    endComponent,
    showLabel = true,
    ...rest
}: TextFieldProps) => {
    const { placeholder, value, disabled, className, type } = rest
    const [isActive, setIsActive] = useState(Boolean(value))

    useEffect(() => console.log('VALUE: ', value), [value])

    const ClearButton = () => {
        const handleClick = () => {
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
                })}
            >
                {showLabel && placeholder && (
                    <label
                        className={cx({
                            [styles['label']]: true,
                        })}
                    >
                        {placeholder}
                    </label>
                )}
                <hr
                    className={cx({
                        [styles['noLabel']]: !(showLabel && placeholder),
                    })}
                />
            </header>
        )
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
                [styles['fullWidth']]: fullWidth,
                [styles['hidden']]: type === 'hidden',
                [styles['isActive']]: value || isActive,
                [className || '']: true,
                [styles['disabled']]: disabled,
            })}
        >
            {placeholder && <Label />}
            <input
                {...rest}
                className={styles['input']}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={isActive && showLabel ? '' : placeholder}
            />
            <ClearButton />
            {endComponent}
        </div>
    )
}
