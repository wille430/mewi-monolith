import { useContext, useEffect, useState } from 'react'
import { SearchContext } from 'common/context/SearchContext'
import { SearchFilterDataProps } from '@mewi/types'
import useQuery from 'common/hooks/useQuery'
import { UserContext } from 'common/context/UserContext'
import useParam from 'common/hooks/useParam'
import { PriceRangeUtils } from 'utils'
import AddWatcherButton from '../../../common/components/SearchFilterArea/AddWatcherButton'
import { Link, useLocation } from 'react-router-dom'
import SearchFilterArea from 'common/components/SearchFilterArea'

const FilterArea = () => {
    const { token } = useContext(UserContext)
    const { filters, setFilters } = useContext(SearchContext)
    const { setQuery } = useQuery()
    const keyword = useParam("q")[0]

    const [formData, setFormData] = useState<SearchFilterDataProps>({ keyword })

    const handleSubmit = () => {

        // Set queries
        setQuery({
            regions: formData.regions?.join(','),
            category: formData.category,
            auction: formData.auction ? "true" : undefined,
            priceRange: PriceRangeUtils.toString(formData.priceRange),
            page: '1'
        })

        setFilters(formData)
    }

    useEffect(() => {
        setFormData(filters)
    }, [])

    return (
        <SearchFilterArea
            searchFilterData={formData}
            setSearchFilterData={newVal => setFormData(newVal)}
            heading='Filtrera sökning'
            showSubmitButton={true}
            showResetButton={true}
            isCollapsable={true}
            onSubmit={handleSubmit}
            footer={token
                ? (
                    <AddWatcherButton searchFilters={formData} />
                ) : (
                    <Link to="/login">Bevaka sökning</Link>
                )
            }
        />
    )
}

export default FilterArea