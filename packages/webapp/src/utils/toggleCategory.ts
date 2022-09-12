import { Category } from '@mewi/prisma/index-browser'
import { ListingSearchFilters } from '@wille430/common'
import { Dispatch, SetStateAction } from 'react'

export const toggleCategory = (
    cat: Category,
    selected: boolean,
    setFilters: Dispatch<SetStateAction<ListingSearchFilters>>
) => {
    if (selected === true) {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories?.includes(cat)
                ? prev.categories
                : [...(prev.categories ?? []), cat],
        }))
    } else {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories?.filter((x) => x !== cat),
        }))
    }
}
