import DropdownMenu, { DropDownMenuProps } from 'components/DropdownMenu/index'
import { HTMLAttributes } from 'react'
import { Override } from 'types/types'

export type LabeledDropdownProps = Override<
    DropDownMenuProps,
    {
        onChange?: (val: any) => void
        value?: string[] | string | null
        closeMenuOnSelect?: boolean
        isMulti?: boolean
        label?: string
    }
> &
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>

const LabeledDropdown = (props: LabeledDropdownProps) => {
    const { closeMenuOnSelect, isMulti, label } = props

    return (
        <div className='flex flex-col'>
            <label className='h-10 inline-block'>{label}</label>
            <DropdownMenu
                data-testid='dropdownMenu'
                {...props}
                closeMenuOnSelect={closeMenuOnSelect || !isMulti}
            />
        </div>
    )
}

export default LabeledDropdown
