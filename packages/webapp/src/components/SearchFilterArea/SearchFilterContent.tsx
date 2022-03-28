import { categoriesOptions, regions, SearchFilterDataProps } from '@mewi/types'
import { FormEvent, ReactNode } from 'react'
import PriceRangeFilter from 'components/SearchFilterArea/PriceRangeFilter'
import ResetButton from './ResetButton'
import Checkbox from '../Checkbox/Checkbox'
import LabeledDropdown from '../LabeledDropdown/LabeledDropdown'
import { v4 } from 'uuid'
import { TextField, HorizontalLine } from '@mewi/ui'
import { Button } from '@mewi/ui'

export interface SearchFilterContentProps {
    searchFilterData: SearchFilterDataProps
    onSubmit?: () => void
    onChange?: (
        key: keyof SearchFilterDataProps,
        value: SearchFilterDataProps[keyof SearchFilterDataProps]
    ) => void
    onValueDelete?: (val: keyof SearchFilterContentProps['searchFilterData']) => void
    children?: ReactNode
    showKeywordField?: boolean
    heading?: string
    showResetButton?: boolean
    showSubmitButton?: boolean
    actions?: ReactNode
    categoryOptions?: { value: string; label: string }[]
    exclude?: { [key: string]: boolean }
    onReset?: () => void
    className?: string
}

const SearchFilterContent = (props: SearchFilterContentProps) => {
    const {
        searchFilterData,
        onSubmit,
        onChange,
        onValueDelete,
        children,
        showKeywordField,
        heading,
        showResetButton,
        showSubmitButton,
        actions,
        categoryOptions,
        exclude = {},
        onReset,
        className,
    } = props

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        onSubmit && onSubmit()
    }

    const handleChange = (
        field: keyof typeof searchFilterData,
        newValue: string | string[] | boolean | number | undefined
    ) => {
        console.log(`Setting ${field} to ${newValue || 'undefined'}`)

        if (searchFilterData[field] === newValue) {
            return
        }

        if (typeof newValue !== 'boolean' && !newValue) {
            console.log('Removing', field, 'from filters')
            onValueDelete && onValueDelete(field)
        } else if (Array.isArray(newValue) && !newValue.length) {
            console.log('Removing', field, 'from filters')
            onValueDelete && onValueDelete(field)
        } else {
            onChange && onChange(field, newValue)
        }
    }

    const handleReset = () => {
        onReset && onReset()
    }

    const Dropdowns = [
        {
            label: 'Välj region:',
            name: 'regions',
            value: searchFilterData.regions,
            onChange: (val: string[]) => handleChange('regions', val),
            isMulti: true,
            options: regions,
            'data-testid': 'regionsSelect',
        },
        {
            label: 'Välj kategori:',
            name: 'category',
            value: searchFilterData.category,
            onChange: (val: string) => handleChange('category', val),
            isMulti: false,
            options: categoryOptions || categoriesOptions,
            'data-testid': 'categorySelect',
        },
    ]

    return (
        <div className={className}>
            <div className='flex flex-col'>
                <form className='flex-grow' onSubmit={handleSubmit}>
                    <h3>{heading}</h3>
                    <HorizontalLine />
                    <div className='grid gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3'>
                        {showKeywordField ? (
                            <div className='flex flex-col'>
                                <label className='inline-block h-10'></label>
                                <TextField
                                    className='input'
                                    placeholder='Sökord'
                                    name='q'
                                    onChange={(value) => handleChange('keyword', value)}
                                    value={searchFilterData.keyword || ''}
                                    data-testid='keywordInput'
                                    fullWidth={true}
                                />
                            </div>
                        ) : (
                            <TextField type='hidden' name='q' value={searchFilterData.keyword} />
                        )}

                        {Dropdowns.map((dropdown) => {
                            if (exclude[dropdown.name]) return null

                            return <LabeledDropdown key={v4()} {...dropdown} />
                        })}

                        {!exclude['price'] && (
                            <PriceRangeFilter
                                gte={searchFilterData.priceRangeGte}
                                lte={searchFilterData.priceRangeLte}
                                onChange={handleChange}
                                data-testid='priceRangeSlider'
                            />
                        )}

                        <div className='p-4'>
                            <Checkbox
                                label='Auktion'
                                name='auction'
                                onClick={(newVal) => handleChange('auction', newVal)}
                                checked={searchFilterData.auction}
                                data-testid='auctionCheckbox'
                            />
                        </div>
                    </div>
                </form>
                <HorizontalLine />
                <div className='flex flex-none items-end justify-between'>
                    <div className='flex'>{actions}</div>
                    <div className='flex flex-row-reverse gap-2'>
                        {children}
                        {showSubmitButton && (
                            <Button
                                type='submit'
                                data-testid='searchFilterSubmitButton'
                                label='Filtrera'
                                className='bg-primary'
                            />
                        )}
                        {showResetButton && <ResetButton onClick={handleReset} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchFilterContent
