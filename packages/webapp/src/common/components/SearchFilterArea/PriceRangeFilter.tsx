import { PriceRange } from '@mewi/types'
import { HTMLAttributes } from 'react'

export interface PriceRangeFilterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    gte?: PriceRange['gte']
    lte?: PriceRange['lte']
    onChange?: (field: 'gte' | 'lte', value?: string) => void
}

const PriceRangeFilter = ({ gte, lte, onChange, ...rest }: PriceRangeFilterProps) => {
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'gte' | 'lte') => {
        if (e.target.value) {
            const value = parseInt(e.target.value).toString()
            onChange && onChange(field, value)
        } else {
            onChange && onChange(field)
        }
    }

    return (
        <div {...rest}>
            <label className='text-white h-10 inline-block'>Välj prisintervall:</label>
            <div className='flex flex-col space-y-3 text-black'>
                <input
                    className='input'
                    value={gte}
                    placeholder='Från (kr)'
                    onChange={(e) => onInputChange(e, 'gte')}
                    data-testid='priceGte'
                ></input>
                <input
                    className='input'
                    value={lte}
                    placeholder='Till (kr)'
                    onChange={(e) => onInputChange(e, 'lte')}
                    data-testid='priceLte'
                ></input>
            </div>
        </div>
    )
}

export default PriceRangeFilter
