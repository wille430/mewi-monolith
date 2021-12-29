import { useContext, useEffect, useState } from 'react'
import { SearchContext } from 'common/context/SearchContext'
import { SearchFilterDataProps } from '@mewi/types'
import useQuery from 'common/hooks/useQuery'
import useParam from 'common/hooks/useParam'
import { PriceRangeUtils } from 'utils'
import AddWatcherButton from '../../../common/components/SearchFilterArea/AddWatcherButton'
import { Link, useLocation, useParams } from 'react-router-dom'
import SearchFilterArea, { SearchFilterAreaProps } from 'common/components/SearchFilterArea'
import { useAppSelector } from 'common/hooks/hooks'

type FilterAreaProps = Omit<SearchFilterAreaProps, 'searchFilterData' | 'setSearchFilterData'> & {
    defaultValues?: SearchFilterDataProps
}

const FilterArea = ({ defaultValues, ...rest }: FilterAreaProps) => {
    const { isLoggedIn } = useAppSelector(state => state.auth)
    const { setFilters } = useContext(SearchContext)
    const { setQuery } = useQuery()
    const location = useLocation()

    const initFormData = {
        keyword: useParam('q')[0],
        ...defaultValues,
    }
    const [formData, setFormData] = useState<SearchFilterDataProps>(initFormData)

    // On re-render, clear filters
    useEffect(() => {
        setFormData(initFormData)
    }, [location])

    const handleSubmit = () => {
        // Set queries
        setQuery({
            q: formData.keyword,
            regions: formData.regions?.join(','),
            category: formData.category,
            auction: formData.auction ? 'true' : undefined,
            priceRange: PriceRangeUtils.toString(formData.priceRange),
            page: '1',
        })

        setFilters(formData)
    }

    return (
        <SearchFilterArea
            {...rest}
            searchFilterData={formData}
            setSearchFilterData={(newVal) => {
                setFormData(newVal)
            }}
            heading='Filtrera sökning'
            showSubmitButton={true}
            showResetButton={true}
            isCollapsable={true}
            onSubmit={handleSubmit}
            actions={
                isLoggedIn ? (
                    <AddWatcherButton searchFilters={formData} data-testid='addWatcherButton' />
                ) : (
                    <Link to='/login'>Bevaka sökning</Link>
                )
            }
        />
    )
}

export default FilterArea
