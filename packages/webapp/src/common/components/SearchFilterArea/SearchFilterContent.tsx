import { categories, categoriesOptions, regions, SearchFilterDataProps } from "@mewi/types"
import PriceRangeFilter from "Routes/Search/FilterArea/PriceRangeFilter"
import ResetButton from "Routes/Search/FilterArea/ResetButton"
import Checkbox from "../Checkbox"
import LabeledDropdown from "../LabeledDropdown"

export interface SearchFilterContentProps {
    searchFilterData: SearchFilterDataProps,
    onSubmit?: Function,
    setSearchFilterData: (newData: SearchFilterDataProps) => void
}

const SearchFilterContent = ({ searchFilterData, onSubmit, setSearchFilterData }: SearchFilterContentProps) => {

    const handleSubmit = () => {
        onSubmit && onSubmit()
    }

    const handleChange = (field: string, newValue: any) => {
        onChange: () => {
            setSearchFilterData({
                ...searchFilterData,
                [field]: newValue
            })
        }
    }

    const handleReset = () => {
        setSearchFilterData({
            keyword: searchFilterData.keyword
        })
    }

    const Dropdowns = [
        {
            label: 'Välj region:',
            name: 'region',
            value: searchFilterData.regions,
            onChange: (val: any) => handleChange('regions', val),
            isMulti: true,
            options: regions
        },
        {
            label: 'Välj kategori:',
            name: 'category',
            value: searchFilterData.category,
            onChange: (val: any) => handleChange('category', val),
            isMulti: false,
            options: categoriesOptions
        }
    ]

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row">
                <div className="flex-grow">
                    <h2 className="pb-2 text-2xl">Filtrera:</h2>
                    <div className="grid gap-x-4 gap-y-6" style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 200px)",
                    }}>
                        <input type="hidden" name="q" value={searchFilterData.keyword} />

                        {Dropdowns.map(dropdown => <LabeledDropdown {...dropdown} />)}

                        <PriceRangeFilter
                            gte={searchFilterData.priceRange?.gte}
                            lte={searchFilterData.priceRange?.lte}
                            onChange={(val, field) => {
                                handleChange('priceRange', {
                                    ...searchFilterData.priceRange,
                                    [field]: val
                                })
                            }
                            }
                        />
                        <div className="p-4">
                            <Checkbox
                                label="Auktion"
                                name="auction"
                                onClick={newVal => handleChange('auction', newVal)}
                                checked={searchFilterData.auction}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-end justify-end flex-none">
                    <div className="flex flex-col">
                        <button className="button px-4" type="submit">Filtrera</button>
                        <ResetButton onClick={handleReset} />
                    </div>
                </div>
            </div>
        </form>
    )
}

export default SearchFilterContent