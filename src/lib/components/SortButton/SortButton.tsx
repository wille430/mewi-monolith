import { ChangeEvent } from 'react'
import { ListingSearchFilters, ListingSort } from '@/common/types'
import { useSearchContext } from '@/lib/hooks/useSearch'

const SortButton = () => {
    const { filters, setFilters } = useSearchContext<ListingSearchFilters>()

    const options: { label: string; value: ListingSort }[] = [
        { label: 'Relevans', value: ListingSort.RELEVANCE },
        {
            label: 'Pris fallande',
            value: ListingSort.PRICE_DESC,
        },
        {
            label: 'Pris stigande',
            value: ListingSort.PRICE_ASC,
        },
        {
            label: 'Datum stigande',
            value: ListingSort.DATE_ASC,
        },
        {
            label: 'Datum fallande',
            value: ListingSort.DATE_DESC,
        },
    ]

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setFilters((prev) => ({
            ...prev,
            sort: parseInt(e.target.value as string) as ListingSort,
        }))
    }

    return (
        <select
            onChange={handleChange}
            defaultValue={ListingSort.RELEVANCE}
            value={filters.sort as unknown as string}
        >
            {options.map((obj, i) => (
                <option key={i} value={obj.value}>
                    {obj.label}
                </option>
            ))}
        </select>
    )
}

export default SortButton
