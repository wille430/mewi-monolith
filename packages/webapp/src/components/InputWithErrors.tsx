import { Input } from 'postcss'
import { HTMLAttributes, useEffect, useState } from 'react'

interface Props {
    errorMessage: string | null | undefined
    [key: string]: HTMLAttributes<Input> | any
}

const InputWithErrors = ({ errorMessage, ...rest }: Props) => {
    const [error, setError] = useState(errorMessage)

    useEffect(() => {
        setError(errorMessage)
    }, [errorMessage])

    return (
        <div>
            <input
                className='p-2 text-black rounded-sm w-full'
                onFocus={(e) => setError(null)}
                {...rest}
            />
            <br />
            {<span className='text-red-500 h-6 inline-block'>{error ? error : ''}</span>}
        </div>
    )
}

export default InputWithErrors
