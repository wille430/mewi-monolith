import clsx from 'clsx'
import React, { InputHTMLAttributes, ReactNode, DetailedHTMLProps, useState } from 'react'
import { FiX } from 'react-icons/fi'
import styles from './TextField.module.scss'

export type TextFieldProps = DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
> & {
    value?: string
    disabled?: boolean
    showClearButton?: boolean
    onReset?: () => void
    fullWidth?: boolean
    endComponent?: ReactNode[]
    showLabel?: boolean
}

export const TextField = ({
    showClearButton,
    onReset,
    fullWidth,
    endComponent,
    showLabel = true,
    value,
    ...rest
}: TextFieldProps) => {
    const { placeholder, className, type } = rest
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null)
    const [isFocused, setIsFocused] = useState(false)
    // const expandPlaceholder = ((placeholder && showLabel) || !!inputRef?.value) && showLabel

    const ClearButton = () => {
        const handleClick = () => {
            if (inputRef) {
                inputRef.value = ''
                setInputRef(null)
                setIsFocused(false)
            }
            onReset && onReset()
        }

        if (showClearButton) {
            return (
                <button
                    type='reset'
                    className={styles['clearButton']}
                    data-testid='clearTextFieldButton'
                    onClick={handleClick}
                    disabled={rest.disabled}
                >
                    <FiX />
                </button>
            )
        } else {
            return null
        }
    }

    return (
        <div
            aria-disabled={rest.disabled}
            data-active={!!inputRef?.value || isFocused}
            data-type={type}
            data-width={fullWidth ? 'full' : 'auto'}
            className={clsx({
                [styles['container']]: true,
                [styles['show-top-border']]: !placeholder || !showLabel,
                [className ?? '']: !!className,
            })}
        >
            {placeholder && showLabel && (
                <header className={styles['header']}>
                    <label className={styles['label']}>{placeholder}</label>
                    <hr
                        className={clsx({
                            [styles['top-border']]: true,
                            [styles['full-width']]: !placeholder,
                        })}
                    />
                </header>
            )}
            <input
                ref={(newRef) => setInputRef(newRef)}
                value={value ?? ''}
                {...rest}
                className={styles['input']}
                placeholder={isFocused && showLabel ? '' : placeholder}
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
            />
            <ClearButton />
            {endComponent}
        </div>
    )
}
