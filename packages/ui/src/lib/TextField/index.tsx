import react, { useCallback, useEffect } from 'react'
import React, { DetailedHTMLProps, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { Override } from '../types'
import styles from './index.module.scss'
import classNames from 'classnames'
import { debounce } from 'lodash'

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
    const [_value, _setValue] = useState('')

    const syncValues = useCallback(
        debounce((val: string) => {
            onChange && onChange(val)
        }, 1000),
        []
    )

    // sync _value with value
    useEffect(() => {
        if (_value !== value) {
            console.log(`Syncing internal state of TextField with placeholder "${placeholder}"`)
            _setValue(value || '')
        }
    }, [value])

    useEffect(() => {
        syncValues(_value)
    }, [_value])

    const ClearButton = () => {
        const handleClick = () => {
            _setValue('')
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
                    [styles['isActive']]: _value || isActive,
                })}
            >
                <label
                    className={cx({
                        [styles['label']]: true,
                        [styles['isActive']]: _value || isActive,
                    })}
                >
                    {placeholder}
                </label>
                <hr />
            </header>
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        _setValue(e.currentTarget.value)
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
                [styles['isActive']]: _value || isActive,
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
                value={_value || ''}
                type={type}
            />
            <ClearButton />
        </div>
    )
}
