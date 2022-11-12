import { Dispatch, useEffect } from 'react'

export const useSyncValues = <T,>(
    [val1, setVal1]: [T, Dispatch<T>],
    [val2, setVal2]: [T, Dispatch<T>]
) => {
    useEffect(() => {
        if (val1 !== val2) {
            setVal1(val2)
        }
    }, [val2])

    useEffect(() => {
        if (val1 !== val2) {
            setVal2(val1)
        }
    }, [val1])
}
