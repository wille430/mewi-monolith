import clsx from 'clsx'
import type {HTMLAttributes} from 'react'
import {Button} from '../Button/Button'

export const SearchInput = (props: HTMLAttributes<HTMLInputElement>) => {
    const {className, ...rest} = props
    return (
        <form className="mx-auto flex w-full" action="/sok">
            <input
                className={clsx('w-full max-w-sm rounded-l-md p-2 px-4 text-black', className)}
                type="text"
                name="keyword"
                placeholder="Vad letar du efter?"
                {...rest}
            />
            <Button className="rounded-l-none bg-secondary" color="secondary" type="submit">Sök</Button>
        </form>
    )
}
