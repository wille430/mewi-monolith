import type { Override } from '@/types/types'
import { createRef, HTMLAttributes } from 'react'

export type CheckboxProps = Override<
    HTMLAttributes<HTMLInputElement>,
    {
        label?: string
        name?: string
        checked?: boolean
        onClick?: (newVal: boolean) => void
    }
>

const Checkbox = ({ onClick, label, name, checked, ...rest }: CheckboxProps) => {
    const inputRef = createRef<HTMLInputElement>()

    const handleClick = () => {
        onClick && onClick(!checked)
    }

    return (
        <div className='space-x-2'>
            <input
                type='checkbox'
                name={name}
                ref={inputRef}
                data-testid='checkbox'
                className='cursor-pointer'
                checked={checked}
                onChange={handleClick}
                {...rest}
            />
            <label htmlFor={name} className='cursor-pointer select-none' onClick={handleClick}>
                {label}
            </label>
        </div>
    )
}

export default Checkbox
