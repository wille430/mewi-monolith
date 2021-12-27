import {
    categoriesOptions,
    Category,
    PriceRange,
    regions,
    SearchFilterDataProps,
} from '@mewi/types'
import { FormEvent, ReactNode } from 'react'
import PriceRangeFilter from 'common/components/SearchFilterArea/PriceRangeFilter'
import ResetButton from './ResetButton'
import Checkbox from '../Checkbox'
import LabeledDropdown from '../LabeledDropdown'
import { v4 } from 'uuid'
import { TextField, HorizontalLine } from '@mewi/ui'
import { Button } from '@mewi/ui'

export interface SearchFilterContentProps {
    searchFilterData: SearchFilterDataProps
    onSubmit?: () => void
    setSearchFilterData: (newData: SearchFilterDataProps) => void
    children?: ReactNode
    showKeywordField?: boolean
    heading?: string
    showResetButton?: boolean
    showSubmitButton?: boolean
    collapse?: boolean
    actions?: ReactNode
    categoryOptions?: {value: string, label: string}[]
    exclude?: { [key: string]: boolean }
}

const SearchFilterContent = (props: SearchFilterContentProps) => {
    const {
        searchFilterData,
        onSubmit,
        setSearchFilterData,
        children,
        showKeywordField,
        heading,
        showResetButton,
        showSubmitButton,
        collapse,
        actions,
        categoryOptions,
        exclude = {},
    } = props

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        onSubmit && onSubmit()
    }

    const handleChange = (field: string, newValue: string | string[] | boolean | PriceRange) => {
        console.log(`Setting ${field} to ${newValue}`)
        setSearchFilterData({
            ...searchFilterData,
            [field]: newValue,
        })
    }

    const handleReset = () => {
        setSearchFilterData({
            keyword: searchFilterData.keyword,
        })
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

    if (!collapse) {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col'>
                        <div className='flex-grow'>
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
                                            value={searchFilterData.keyword}
                                            data-testid='keywordInput'
                                            fullWidth={true}
                                        />
                                    </div>
                                ) : (
                                    <TextField
                                        type='hidden'
                                        name='q'
                                        value={searchFilterData.keyword}
                                    />
                                )}

                                {Dropdowns.map((dropdown) => {
                                    if (exclude[dropdown.name]) return

                                    return <LabeledDropdown key={v4()} {...dropdown} />
                                })}

                                {!exclude['price'] && (
                                    <PriceRangeFilter
                                        gte={searchFilterData.priceRange?.gte}
                                        lte={searchFilterData.priceRange?.lte}
                                        onChange={(field, val) => {
                                            handleChange('priceRange', {
                                                ...searchFilterData.priceRange,
                                                [field]: val,
                                            })
                                        }}
                                        data-testid='priceRangeSlider'
                                    />
                                )}

                                <div className='p-4'>
                                    <Checkbox
                                        label='Auktion'
                                        name='auction'
                                        onClick={(newVal) => handleChange('auction', newVal)}
                                        checked={searchFilterData.auction || false}
                                        data-testid='auctionCheckbox'
                                    />
                                </div>
                            </div>
                        </div>
                        <HorizontalLine />
                        <div className='flex items-end justify-between flex-none'>
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
                </form>
            </div>
        )
    }

    return <div></div>
}

export default SearchFilterContent
