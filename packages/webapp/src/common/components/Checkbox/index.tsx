import { Override } from 'types/types';
import React, { createRef, HTMLAttributes } from 'react';

export type CheckboxProps = Override<HTMLAttributes<HTMLInputElement>, {
    label?: string,
    name?: string,
    checked?: boolean,
    onChange?: (val?: boolean) => void
}>

const Checkbox = ({ onChange, label, name, checked }: CheckboxProps) => {

    const inputRef = createRef<HTMLInputElement>()

    const setChecked = (checked: boolean) => {
        onChange && onChange(checked)
    }

    return (
        <div className="space-x-2">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                data-testid="checkbox"
                ref={inputRef}
                className="cursor-pointer"
                onClick={e => {
                    setChecked(e.currentTarget.checked)
                }}
            />
            <label
                htmlFor={name}
                className="cursor-pointer select-none"
                onClick={e => {
                    setChecked(!inputRef.current?.checked)
                }}
            >
                {label}
            </label>
        </div>
    );
}

export default Checkbox;