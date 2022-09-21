import { toggleCategory } from '@/utils/toggleFilters'
import { ListingSearchFilters, categories } from '@wille430/common'
import dynamic from 'next/dynamic'
import { Dispatch, SetStateAction } from 'react'
import Checkbox from '../Checkbox/Checkbox'
import { LabeledTextField } from '../LabeledTextField/LabeledTextField'
import { PriceRangeFilter } from '../PriceRangeFilter/PriceRangeFilter'

const LabeledDropdown = dynamic(() => import('../LabeledDropdown/LabeledDropdown'))

export interface ListingFiltersProps {
    filters: ListingSearchFilters
    setFilters: Dispatch<SetStateAction<ListingSearchFilters>>
    showCategory?: boolean
}

export const ListingFilters = ({
    filters,
    setFilters,
    showCategory = false,
}: ListingFiltersProps) => (
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
            value={filters.keyword ?? ''}
            data-testid='keywordInput'
            fullWidth
        />
        <LabeledTextField
            label='Plats'
            placeholder='Plats (stad, region, etc)'
            name='region'
            showLabel={false}
            onChange={(e) =>
                setFilters({
                    ...filters,
                    region: e.target.value,
                })
            }
            value={filters.region ?? ''}
            data-testid='regionInput'
            fullWidth
        />
        {showCategory && (
            <LabeledDropdown
                label='Kategori'
                name='category'
                value={filters.categories}
                onChange={(val) =>
                    // TODO: change dropdown to multi dropdown
                    toggleCategory(val, true, setFilters)
                }
                options={categories}
                data-testid='categorySelect'
            />
        )}

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
