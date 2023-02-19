// eslint-disable-next-line lodash/import-scope
import type {DebouncedFunc} from 'lodash'
import debounce from 'lodash/debounce'
import {SetStateAction, useEffect, useMemo, useState} from 'react'

export function useDebounce<T>(
    value: T,
    delay?: number
): [T, DebouncedFunc<(value: SetStateAction<T>, force?: boolean) => void>]

export function useDebounce<T>(value: T, delay = 1000) {
    const [realValue, setRealValue] = useState(value)

    const setValue = useMemo(() => {
        return debounce((value: SetStateAction<T>) => {
            setRealValue(value)
        }, delay)
    }, [value])

    useEffect(() => {
        setValue(value)

        return () => {
            setValue.cancel()
        }
    }, [value])

    return [realValue, setRealValue]
}
