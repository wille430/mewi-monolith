import react from 'react'
import React, { DetailedHTMLProps, useEffect, useState } from 'react'
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
    const [inputValue, setInputValue] = useState(value || '')

    useEffect(() => {
        onChange && onChange(inputValue)
    }, [inputValue])

    useEffect(() => {
        setInputValue(value || '')
    }, [value])

    const ClearButton = () => {
        const handleClick = () => {
            setInputValue('')
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
            return <></>
        }
    }

    const Label = () => {
        return (
            <header>
                <label
                    className={cx({
                        [styles['label']]: true,
                        [styles['isActive']]: inputValue || isActive,
                    })}
                >
                    {placeholder}
                </label>
            </header>
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value)
    }

    const handleClick = () => {}

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
                [styles['isActive']]: isActive || inputValue,
                [styles['fullWidth']]: fullWidth,
                [styles['hidden']]: type === 'hidden',
            })}
        >
            <Label />
            <input
                {...rest}
                className={`${styles['input']} ${className}`}
                onChange={handleChange}
                onClick={handleClick}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={inputValue}
            />
            <ClearButton />
        </div>
    )
}
