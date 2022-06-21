import { Button } from '@wille430/ui'
import { HTMLAttributes } from 'react'

export const SearchInput = (props: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className='flex flex-col w-full items-end' {...props}>
            <form className='flex mx-auto w-full' action='/sok'>
                <input
                    className='p-2 rounded-l-md px-4 w-full max-w-sm text-black'
                    type='text'
                    name='keyword'
                    placeholder='Vad letar du efter?'
                />
                <Button className='rounded-l-none' color='secondary' type='submit' label='Sök' />
            </form>

            <a className='text-secondary mt-2' href='/filter'>
                {'Advancerade filter >>'}
            </a>
        </div>
    )
}
