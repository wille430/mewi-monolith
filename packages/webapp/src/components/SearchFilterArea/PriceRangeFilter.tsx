import { TextField } from '@mewi/ui'
import { HTMLAttributes } from 'react'

export interface PriceRangeFilterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    gte?: number
    lte?: number
    onChange: (field: 'priceRangeGte' | 'priceRangeLte', value?: number) => void
}

const PriceRangeFilter = ({ gte, lte, onChange, ...rest }: PriceRangeFilterProps) => {
    return (
        <div {...rest}>
            <label className='h-10 inline-block'>Välj prisintervall:</label>
            <div className='flex flex-col space-y-3 text-black'>
                <TextField
                    className='input'
                    value={gte?.toString()}
                    placeholder='Från (kr)'
                    onChange={(value) => onChange('priceRangeGte', parseFloat(value))}
                    data-testid='priceGte'
                    showClearButton={true}
                    fullWidth={true}
                ></TextField>
                <TextField
                    className='input'
                    value={lte?.toString()}
                    placeholder='Till (kr)'
                    onChange={(value) => onChange('priceRangeLte', parseFloat(value))}
                    data-testid='priceLte'
                    showClearButton={true}
                    fullWidth={true}
                ></TextField>
            </div>
        </div>
    )
}

export default PriceRangeFilter
