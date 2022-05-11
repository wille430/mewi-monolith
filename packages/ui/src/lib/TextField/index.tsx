import react, { ReactNode, useCallback, useEffect, useRef } from 'react'
import React, { DetailedHTMLProps, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { Override } from '../types'
import styles from './index.module.scss'
import classNames from 'classnames'
import { debounce } from 'lodash'

const cx = classNames.bind(styles)

export type TextFieldProps = Override<
    DetailedHTMLProps<react.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    {
        showClearButton?: boolean
        onReset?: () => void
        value?: string
        onChange?: (value?: string) => void
        fullWidth?: boolean
        debounced?: boolean
        endComponent?: ReactNode[]
        showLabel?: boolean
    }
> & {
    'data-testid'?: string
}

export const TextField = ({
    onChange,
    className,
    onReset,
    placeholder,
    showClearButton,
    value,
    fullWidth,
    type,
    debounced = false,
    showLabel = true,
    endComponent,
    disabled,
    ...rest
}: TextFieldProps) => {
    const [isActive, setIsActive] = useState(false)
    const [_value, _setValue] = useState<TextFieldProps['value']>(value)

    const syncValues = useCallback(
        debounced
            ? debounce(() => {
                  if (_value !== value) {
                      onChange && onChange(_value)
                  }
              }, 1000)
            : () => {
                  if (_value !== value) {
                      onChange && onChange(_value)
                  }
              },
        [_value, value]
    )

    const firstRender = useRef(true)

    // sync _value with value
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }

        if (_value !== value) {
            _setValue(value)
        }
    }, [value])

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }

        syncValues()
    }, [_value])

    const ClearButton = () => {
        const handleClick = () => {
            _setValue(undefined)
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
                {showLabel && placeholder &&
                <label
                    className={cx({
                        [styles['label']]: true,
                        [styles['isActive']]: _value || isActive,
                    })}
                >
                    {placeholder}
                </label>}
                <hr
                    className={cx({
                        [styles['noLabel']]: !(showLabel && placeholder),
                    })}
                />
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
                [styles['isActive']]: (_value || isActive) && placeholder,
                [styles['fullWidth']]: fullWidth,
                [styles['hidden']]: type === 'hidden',
                [className || '']: true,
                [styles['disabled']]: disabled,
            })}
        >
            {placeholder && <Label />}
            <input
                {...rest}
                className={styles['input']}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={_value}
                type={type}
                disabled={disabled}
                placeholder={(isActive && showLabel) ? '' : placeholder}
            />
            <ClearButton />
            {endComponent}
        </div>
    )
}
