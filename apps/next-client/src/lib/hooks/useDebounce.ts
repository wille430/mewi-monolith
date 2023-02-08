// eslint-disable-next-line lodash/import-scope
import { DebouncedFunc } from 'lodash'
import debounce from 'lodash/debounce'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'

export type UseDebounceOptions<T> = {
    nonDebouncedValues?: T extends Record<any, any> ? Partial<T> : undefined
    setInputValue?: Dispatch<SetStateAction<T>>
}

export function useDebounce<T>(
    value: T,
    delay?: number,
    options?: UseDebounceOptions<T>
): [T, DebouncedFunc<(value: SetStateAction<T>, force?: boolean) => void>]

export function useDebounce<T>(value: T, delay = 1000, options: UseDebounceOptions<T> = {}) {
    const { nonDebouncedValues } = options
    const [realValue, setRealValue] = useState(value)

    const setValue = useMemo(() => {
        return debounce((value: SetStateAction<T>) => {
            setRealValue(value)
        }, delay)
    }, [value])

    useEffect(() => {
        setValue(value)

        if (nonDebouncedValues) {
            setRealValue((prev) => ({
                ...prev,
                ...nonDebouncedValues,
            }))
        }

        return () => {
            setValue.cancel()
        }
    }, [value])

    return [realValue, setRealValue]
}
