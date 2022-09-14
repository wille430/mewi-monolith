import Checkbox from '../Checkbox/Checkbox'

interface CheckboxListProps {
    list: {
        value: any
        label?: string
        checked?: boolean
        onClick: (newVal: boolean) => any
    }[]
    prefix: string
}

export const CheckboxList = ({ list, prefix }: CheckboxListProps) => {
    return (
        <ul className='list-none'>
            {list.map((ele) => {
                const name = `${prefix}-${list}`
                return (
                    <li className='mx-2 hover:cursor-pointer' key={ele.value as string}>
                        <Checkbox
                            label={ele.label ?? (ele.value as string)}
                            name={name}
                            data-testid={name}
                            checked={ele.checked}
                            onClick={ele.onClick as any}
                        />
                    </li>
                )
            })}
        </ul>
    )
}
