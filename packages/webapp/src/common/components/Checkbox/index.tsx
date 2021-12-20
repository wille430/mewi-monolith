import { Override } from 'types/types';
import React, { createRef, HTMLAttributes, useState } from 'react';

export type CheckboxProps = Override<HTMLAttributes<HTMLInputElement>, {
    label?: string,
    name?: string,
    checked?: boolean,
    onClick?: (newVal: boolean) => void
}>

const Checkbox = ({ onClick, label, name, checked, ...rest }: CheckboxProps) => {

    // const [_checked, _setChecked] = useState(checked)

    const inputRef = createRef<HTMLInputElement>()

    const onChange = (newVal?: boolean | string) => {
        if (typeof newVal === 'boolean') {
            onClick && onClick(newVal)
        } else {

            onClick && onClick(newVal === "true" ? true : false)
        }
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
                onClick={e => onChange(e.currentTarget.value)}
                {...rest}
            />
            <label
                htmlFor={name}
                className="cursor-pointer select-none"
                onClick={() => onChange(inputRef.current?.value)}
            >
                {label}
            </label>
        </div>
    );
}

export default Checkbox;