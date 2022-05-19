import { HTMLAttributes, useEffect, useState } from 'react'

interface Props {
    errorMessage: string | null | undefined
    [key: string]: HTMLAttributes<HTMLInputElement> | any
}

const InputWithErrors = ({ errorMessage, ...rest }: Props) => {
    const [error, setError] = useState(errorMessage)

    useEffect(() => {
        setError(errorMessage)
    }, [errorMessage])

    return (
        <div>
            <input
                className='w-full rounded-sm p-2 text-black'
                onFocus={() => setError(null)}
                {...rest}
            />
            <br />
            {<span className='inline-block h-6 text-red-500'>{error ? error : ''}</span>}
        </div>
    )
}

export default InputWithErrors
