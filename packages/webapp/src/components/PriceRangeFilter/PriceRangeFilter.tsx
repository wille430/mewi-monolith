import type { HTMLAttributes } from 'react'
import { TextField } from '../TextField/TextField'

export interface PriceRangeFilterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    gte?: number
    lte?: number
    onChange: (field: 'priceRangeGte' | 'priceRangeLte', value?: number) => void
}

export const PriceRangeFilter = ({ gte, lte, onChange, ...rest }: PriceRangeFilterProps) => {
    return (
        <div {...rest}>
            <div className='flex flex-col space-y-3 text-black'>
                <TextField
                    className='input'
                    value={(gte ?? '').toString()}
                    placeholder='Från (kr)'
                    onChange={(e) =>
                        onChange('priceRangeGte', parseFloat(e.target.value) || undefined)
                    }
                    onReset={() => onChange('priceRangeGte', undefined)}
                    data-testid='priceGte'
                    showClearButton={true}
                    fullWidth={true}
                ></TextField>
                <TextField
                    className='input'
                    value={(lte ?? '').toString()}
                    placeholder='Till (kr)'
                    onChange={(e) =>
                        onChange('priceRangeLte', parseFloat(e.target.value) || undefined)
                    }
                    onReset={() => onChange('priceRangeLte', undefined)}
                    data-testid='priceLte'
                    showClearButton={true}
                    fullWidth={true}
                ></TextField>
            </div>
        </div>
    )
}
