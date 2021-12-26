import { PriceRange } from '@mewi/types'
import { TextField } from '@mewi/ui'
import { HTMLAttributes } from 'react'

export interface PriceRangeFilterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    gte?: PriceRange['gte']
    lte?: PriceRange['lte']
    onChange?: (field: 'gte' | 'lte', value?: string) => void
}

const PriceRangeFilter = ({ gte, lte, onChange, ...rest }: PriceRangeFilterProps) => {
    const onInputChange = (value: string, field: 'gte' | 'lte') => {
        if (value) {
            onChange && onChange(field, value)
        } else {
            onChange && onChange(field)
        }
    }

    return (
        <div {...rest}>
            <label className='h-10 inline-block'>Välj prisintervall:</label>
            <div className='flex flex-col space-y-3 text-black'>
                <TextField
                    className='input'
                    value={gte?.toString() || ''}
                    placeholder='Från (kr)'
                    onChange={(value) => onInputChange(value, 'gte')}
                    data-testid='priceGte'
                    showClearButton={true}
                    fullWidth={true}
                ></TextField>
                <TextField
                    className='input'
                    value={lte?.toString() || ''}
                    placeholder='Till (kr)'
                    onChange={(value) => onInputChange(value, 'lte')}
                    data-testid='priceLte'
                    showClearButton={true}
                    fullWidth={true}
                ></TextField>
            </div>
        </div>
    )
}

export default PriceRangeFilter
