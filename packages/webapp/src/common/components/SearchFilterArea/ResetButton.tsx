import { useHistory, useLocation } from "react-router"
import { SearchParamsUtils } from "utils"

export interface ResetButtonProps {
    onClick?: () => void
}

const ResetButton = ({ onClick }: ResetButtonProps) => {
    const history = useHistory()
    const location = useLocation()

    const clearFilters = () => {
        const newSearchParams = new URLSearchParams(location.search)
        SearchParamsUtils.searchParams.forEach(param => newSearchParams.delete(param))

        history.replace({
            pathname: location.pathname,
            search: new URLSearchParams(newSearchParams).toString()
        })
    }

    return (
        <button className="h-full text-xs text-right py-2" type="reset" onClick={() => {
            clearFilters()
            onClick && onClick()
        }}>
            Ta bort filter
        </button>
    );
}

export default ResetButton;