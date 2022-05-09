import { Button } from '@mewi/ui'

export const SearchInput = () => {
    return (
        <div className='flex flex-col w-full'>
            <form className='flex mx-auto w-full' action='/sok'>
                <input
                    className='p-2 rounded-l-md px-4 w-full max-w-sm'
                    type='text'
                    name='query'
                    placeholder='Vad letar du efter?'
                />
                <Button className='rounded-l-none' color='secondary' type='submit' label='Sök' />
            </form>

            <a className='text-secondary w-full text-right mt-2' href='/filter'>
                {'Advancerade filter >>'}
            </a>
        </div>
    )
}