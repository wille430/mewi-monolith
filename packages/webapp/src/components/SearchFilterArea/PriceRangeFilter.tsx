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
            <label className='inline-block h-10'>Välj prisintervall:</label>
            <div className='flex flex-col space-y-3 text-black'>
                <TextField
                    className='input'
                    value={gte?.toString() || ''}
                    placeholder='Från (kr)'
                    onChange={(value) =>
                        onChange('priceRangeGte', value ? parseFloat(value) : undefined)
                    }
                    data-testid='priceGte'
                    showClearButton={true}
                    fullWidth={true}
                ></TextField>
                <TextField
                    className='input'
                    value={lte?.toString() || ''}
                    placeholder='Till (kr)'
                    onChange={(value) =>
                        onChange('priceRangeLte', value ? parseFloat(value) : undefined)
                    }
                    data-testid='priceLte'
                    showClearButton={true}
                    fullWidth={true}
                ></TextField>
            </div>
        </div>
    )
}

export default PriceRangeFilter
