import { useHistory, useLocation } from 'react-router'
import { SearchParamsUtils } from 'utils'
import { Button } from '@mewi/ui'

export interface ResetButtonProps {
    onClick?: () => void
}

const ResetButton = ({ onClick }: ResetButtonProps) => {
    const history = useHistory()
    const location = useLocation()

    const clearFilters = () => {
        const newSearchParams = new URLSearchParams(location.search)
        SearchParamsUtils.searchParams.forEach((param) => newSearchParams.delete(param))

        history.replace({
            pathname: location.pathname,
            search: new URLSearchParams(newSearchParams).toString(),
        })
    }

    return (
        <Button
            type='reset'
            variant='text'
            onClick={() => {
                clearFilters()
                onClick && onClick()
            }}
            label='Ta bort filter'
            defaultCasing
        />
    )
}

export default ResetButton
