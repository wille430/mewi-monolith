import { useEffect, useState } from "react"
import useParam from "./useParam"

const useFilterState = (paramName: string) => {
    const [ param, ] = useParam(paramName)


    const getState = () => {
        return param || ''
    }

    const [state, setState] = useState<string>(getState())

    useEffect(() => {
        setState(getState())
        // eslint-disable-next-line
    }, [param])

    return {
        state,
        setState
    }
}

export default useFilterState