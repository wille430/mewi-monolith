import type { Category, ListingOrigin } from '@/common/schemas'
import type { ListingSearchFilters } from '@/common/schemas'
import type { Dispatch, SetStateAction } from 'react'

export const toggleCategory = (
    cat: Category,
    selected: boolean,
    setFilters: Dispatch<SetStateAction<ListingSearchFilters>>
) => setFilters(toggleElement('categories', cat, selected))

export const toggleOrigin = (
    origin: ListingOrigin,
    selected: boolean,
    setFilters: Dispatch<SetStateAction<ListingSearchFilters>>
) => setFilters(toggleElement('origins', origin, selected))

export const toggleElement = <T>(key: string, value: T, selected: boolean) => {
    if (selected === true) {
        return (prev) => ({
            ...prev,
            [key]: prev[key]?.includes(value) ? prev[key] : [...(prev[key] ?? []), value],
        })
    } else {
        return (prev) => ({
            ...prev,
            [key]: prev[key]?.filter((x) => x !== value),
        })
    }
}
