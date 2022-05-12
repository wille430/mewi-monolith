import { ListingSearchFilters, regions } from '@wille430/common'
import { Dispatch, SetStateAction } from 'react'
import Checkbox from '../Checkbox/Checkbox'
import LabeledDropdown from '../LabeledDropdown/LabeledDropdown'
import { LabeledTextField } from '../LabeledTextField/LabeledTextField'
import { PriceRangeFilter } from '../PriceRangeFilter/PriceRangeFilter'

export interface ListingFilterFormProps {
    filters: ListingSearchFilters
    setFilters: Dispatch<SetStateAction<ListingSearchFilters>>
}

export const ListingFilters = ({ filters, setFilters }) => (
    <>
        <LabeledTextField
            label='Sökord'
            placeholder='Filtrera efter produktnamn...'
            showLabel={false}
            name='keyword'
            onChange={(e) =>
                setFilters({
                    ...filters,
                    keyword: e.target.value,
                })
            }
            value={filters.keyword}
            data-testid='keywordInput'
            fullWidth
        />
        <LabeledDropdown
            label='Region'
            name='regions'
            value={filters.regions}
            onChange={(val) =>
                setFilters({
                    ...filters,
                    regions: val,
                })
            }
            isMulti={true}
            options={regions}
            data-testid='regionsSelect'
        />
        <PriceRangeFilter
            gte={filters.priceRangeGte}
            lte={filters.priceRangeLte}
            onChange={(key, val) =>
                setFilters({
                    ...filters,
                    [key]: val,
                })
            }
            data-testid='priceRangeSlider'
        />
        <div className='px-4 pt-4 pb-2'>
            <Checkbox
                label='Auktion'
                name='auction'
                onClick={(val) =>
                    setFilters({
                        ...filters,
                        auction: val,
                    })
                }
                checked={filters.auction}
                data-testid='auctionCheckbox'
            />
        </div>
    </>
)
