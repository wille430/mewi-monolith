import { InputHTMLAttributes } from 'react'

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    onClick?: (newVal: boolean) => void
}

const Checkbox = ({ onClick, label, name, checked, ...rest }: CheckboxProps) => {
    const handleClick = () => {
        onClick && onClick(!checked)
    }

    return (
        <div className='space-x-2' onClick={handleClick}>
            <input
                type='checkbox'
                name={name}
                checked={checked}
                data-testid='checkbox'
                className='cursor-pointer'
                onChange={handleClick}
                {...rest}
            />
            <label htmlFor={name} className='cursor-pointer select-none'>
                {label}
            </label>
        </div>
    )
}

export default Checkbox
