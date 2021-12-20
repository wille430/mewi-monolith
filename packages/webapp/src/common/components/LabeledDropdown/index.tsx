import DropdownMenu, { DropDownMenuProps } from 'common/components/DropdownMenu/index'
import { Override } from 'types/types'

export type LabeledDropdownProps = Override<DropDownMenuProps, {
    onChange?: (val: any) => void,
    value?: string[] | string | null,
    closeMenuOnSelect?: boolean,
    isMulti?: boolean,
    label?: string
}>

const LabeledDropdown = (props: LabeledDropdownProps) => {

    const { closeMenuOnSelect, isMulti, label } = props

    return (
        <div className="flex flex-col">
            <label className="text-white h-10 inline-block">{label}</label>
            {/* @ts-ignore */}
            <DropdownMenu
                {...props}
                data-testid="dropdownMenu"
                closeMenuOnSelect={closeMenuOnSelect || !isMulti}
            />
        </div>
    )
}

export default LabeledDropdown