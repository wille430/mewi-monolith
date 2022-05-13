import { useListingFilters } from '@/hooks/useListingFilters'
import { ListingSort } from '@wille430/common'

const SortButton = () => {
    const { setFilters, debouncedFilters } = useListingFilters()

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

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(
            (prev) => ({
                ...prev,
                sort: parseInt(e.target.value as string) as ListingSort,
            }),
            true
        )
    }

    return (
        <select
            onChange={handleChange}
            defaultValue={ListingSort.RELEVANCE}
            value={debouncedFilters.sort as unknown as string}
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
