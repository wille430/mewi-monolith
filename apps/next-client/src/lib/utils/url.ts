import { ListingSearchFilters as ListingFilters } from '@/common/types/ListingSearchFilters'
import omit from 'lodash/omit'
import { stringify } from 'query-string'

export const stringifySearchPath = (filters: ListingFilters) => {
    const excludeFilters: (keyof ListingFilters)[] = []

    const omittedFilters = omit(filters, excludeFilters)

    let path = '/sok'

    if (Object.keys(omittedFilters).length) {
        path += `?${stringify(omittedFilters)}`
    }

    return path
}
