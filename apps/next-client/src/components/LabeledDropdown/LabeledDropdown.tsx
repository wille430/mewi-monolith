import type { HTMLAttributes } from "react";
import type { DropDownMenuProps } from "../DropdownMenu/DropdownMenu";
import DropdownMenu from "../DropdownMenu/DropdownMenu";

export type LabeledDropdownProps = DropDownMenuProps & {
    onChange?: (val: any) => void
    value?: string[] | string | null
    closeMenuOnSelect?: boolean
    isMulti?: boolean
    label?: string
} & Omit<HTMLAttributes<HTMLDivElement>, "onChange">

const LabeledDropdown = (props: LabeledDropdownProps) => {
    const { closeMenuOnSelect, isMulti, label } = props;

    return (
        <div className='flex flex-col'>
            <label className='inline-block h-8'>{label}</label>
            <DropdownMenu
                data-testid='dropdownMenu'
                {...props}
                closeMenuOnSelect={closeMenuOnSelect || !isMulti}
            />
        </div>
    );
};

export default LabeledDropdown;
