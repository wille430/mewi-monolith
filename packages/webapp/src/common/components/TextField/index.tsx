import { placeholder } from '@babel/types'
import react from 'react'
import React, { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { Override } from 'types/types'
import styles from './index.module.scss'

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

const TextField = ({
    onChange,
    className,
    onReset,
    placeholder,
    showClearButton,
    value,
    fullWidth,
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
                    className={styles.clearButton}
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
                    className={`${styles.label} ${inputValue || isActive ? styles.isActive : ''}`}
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
        <div className={styles.wrapper}>
            <div className={`${styles.container} ${isActive || inputValue ? styles.isActive : ''} ${fullWidth && styles.fullWidth}`}>
                <Label />
                <input
                    {...rest}
                    className={`${styles.input} ${className}`}
                    onChange={handleChange}
                    onClick={handleClick}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={inputValue}
                />
                <ClearButton />
            </div>
        </div>
    )
}

export default TextField
