import { useContext, useEffect, useState } from 'react'
import { SearchContext } from 'common/context/SearchContext'
import { SearchFilterDataProps } from '@mewi/types'
import useQuery from 'common/hooks/useQuery'
import useParam from 'common/hooks/useParam'
import { PriceRangeUtils } from 'utils'
import AddWatcherButton from '../../../common/components/SearchFilterArea/AddWatcherButton'
import { Link } from 'react-router-dom'
import SearchFilterArea from 'common/components/SearchFilterArea'
import { UserContext } from 'common/context/UserContext'

const FilterArea = () => {
    const { isLoggedIn } = useContext(UserContext)
    const { filters, setFilters } = useContext(SearchContext)
    const { setQuery } = useQuery()

    const [formData, setFormData] = useState<SearchFilterDataProps>({
        keyword: filters.keyword
    })

    const handleSubmit = () => {

        // Set queries
        setQuery({
            q: filters.keyword,
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
            footer={isLoggedIn
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