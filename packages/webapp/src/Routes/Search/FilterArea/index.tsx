import { FormEvent, useContext, useEffect, useState } from 'react'
import { SearchContext } from 'common/context/SearchContext'
import PriceRangeFilter from './PriceRangeFilter'
import FilterCheckbox from './FilterCheckbox'
import FilterDropdown from 'common/components/LabeledDropdown'
import ResetButton from './ResetButton'
import { FiArrowDown, FiArrowUp } from 'react-icons/fi'
import { useWindowWidth } from '@react-hook/window-size'
import AddWatcherButton from './AddWatcherButton'
import { categoriesOptions as categories, regions } from '@mewi/types'
import useQuery from 'common/hooks/useQuery'
import { UserContext } from 'common/context/UserContext'
import { v4 } from 'uuid'
import { Link } from 'react-router-dom'
import useParam from 'common/hooks/useParam'
import { PriceRangeUtils } from 'utils'
import { PriceRangeProps } from 'types/types'

export interface FilterFormDataProps {
    regions: string[],
    category: string,
    isAuction: boolean,
    priceRange: PriceRangeProps,
    keyword: string
}

const FilterArea = () => {
    const { setSearch } = useContext(SearchContext)
    const { token } = useContext(UserContext)
    const { setQuery } = useQuery()
    const query = useParam("q").param

    const initFormData: FilterFormDataProps = {
        regions: useParam("region").param.split(','),
        category: useParam("category").param,
        isAuction: useParam("isAuction").param === "true" ? true : false,
        priceRange: PriceRangeUtils.toObject(useParam("price").param),
        keyword: query
    }

    const [formData, setFormData] = useState<FilterFormDataProps>(initFormData)

    // FilterData state for categories and regions

    const [hidden, setHidden] = useState(true)
    const windowWidth = useWindowWidth()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        // Set queries
        setQuery({
            region: formData.regions.join(','),
            category: formData.category,
            isAuction: formData.isAuction ? "true" : "false",
            price: PriceRangeUtils.toString(formData.priceRange),
            page: '1'
        })

        setSearch((prevState: any) => ({
            ...prevState,
            searchId: v4()
        }))
    }

    const handleReset = () => {
        setFormData(initFormData)
    }
    
    return (
        <section className="bg-blue rounded-md p-4 text-white shadow-md">
            <div className="block sm:hidden">
                {hidden ? <FiArrowDown onClick={e => setHidden(false)} /> : <FiArrowUp onClick={e => setHidden(true)} />}
            </div>
            <form onSubmit={handleSubmit} style={{
                display: (hidden && windowWidth < 625) ? 'none' : 'block'
            }}>
                <div className="flex flex-col lg:flex-row">
                    <div className="flex-grow">
                        <h2 className="pb-2 text-2xl">Filtrera:</h2>
                        <div className="grid gap-x-4 gap-y-6" style={{
                            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 200px)",
                        }}>
                            <input type="hidden" name="q" value={query} />

                            <FilterDropdown
                                value={formData.regions}
                                onChange={val => {
                                    setFormData({
                                        ...formData,
                                        regions: val || []
                                    })
                                }}
                                label="Välj region:"
                                name="region"
                                options={regions}
                                isMulti
                            />

                            <FilterDropdown
                                value={formData.category}
                                onChange={val => {
                                    setFormData({
                                        ...formData,
                                        category: val || ""
                                    })
                                }}
                                label="Välj kategorier:"
                                name="category"
                                options={categories || []}
                            />

                            <PriceRangeFilter
                                gte={formData.priceRange.gte}
                                lte={formData.priceRange.lte}
                                onChange={(val, field) => {
                                    setFormData({
                                        ...formData,
                                        priceRange: {
                                            ...formData.priceRange,
                                            [field]: val
                                        }
                                    })
                                }}
                            />
                            <div className="p-4">
                                <FilterCheckbox label="Auktion" name="isAuction" />
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
            {token ? <AddWatcherButton formData={formData} /> : <Link to="/login">Bevaka sökning</Link>}
        </section>
    )
}

export default FilterArea