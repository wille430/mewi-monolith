import useToken from 'common/hooks/useToken'
import { Link } from 'react-router-dom'
import AddWatcherButton from 'Routes/Search/FilterArea/AddWatcherButton'
import SearchFilterContent, { SearchFilterContentProps } from './SearchFilterContent'

export interface SearchFilterAreaProps extends SearchFilterContentProps {
    collapse?: boolean
}

const SearchFilterArea = ({ collapse, ...rest }: SearchFilterAreaProps) => {

    const { token } = useToken()

    return (
        <section className="bg-blue rounded-md p-4 text-white shadow-md">
            <SearchFilterContent {...rest} />
            {token ? <AddWatcherButton searchFilters={rest.searchFilterData} /> : <Link to="/login">Bevaka sökning</Link>}
        </section>
    )
}

export default SearchFilterArea