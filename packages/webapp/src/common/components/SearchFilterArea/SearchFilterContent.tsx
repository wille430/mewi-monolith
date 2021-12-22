import { categoriesOptions, PriceRange, regions, SearchFilterDataProps } from '@mewi/types'
import { FormEvent, ReactNode } from 'react'
import PriceRangeFilter from 'common/components/SearchFilterArea/PriceRangeFilter'
import ResetButton from './ResetButton'
import Checkbox from '../Checkbox'
import LabeledDropdown from '../LabeledDropdown'

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
    footer?: ReactNode
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
        footer,
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
            options: categoriesOptions,
            'data-testid': 'categorySelect',
        },
    ]

    if (!collapse) {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col lg:flex-row'>
                        <div className='flex-grow'>
                            <h2 className='pb-2 text-2xl'>{heading}</h2>
                            <div
                                className='grid gap-x-4 gap-y-6'
                                style={{
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 200px)',
                                }}
                            >
                                {showKeywordField ? (
                                    <div className='flex flex-col'>
                                        <label className='inline-block h-10'>Sök</label>
                                        <input
                                            className='input'
                                            placeholder='Sökord'
                                            name='q'
                                            onChange={(e) =>
                                                handleChange('keyword', e.target.value)
                                            }
                                            value={searchFilterData.keyword}
                                            data-testid='keywordInput'
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type='hidden'
                                        name='q'
                                        value={searchFilterData.keyword}
                                    />
                                )}

                                {Dropdowns.map((dropdown) => (
                                    <LabeledDropdown {...dropdown} />
                                ))}

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
                        <div className='flex items-end justify-end flex-none'>
                            <div className='flex flex-col'>
                                {children}
                                {showSubmitButton && (
                                    <button className='button px-4' type='submit'>
                                        Filtrera
                                    </button>
                                )}
                                {showResetButton && <ResetButton onClick={handleReset} />}
                            </div>
                        </div>
                    </div>
                </form>
                {footer}
            </div>
        )
    }

    return <div></div>
}

export default SearchFilterContent
