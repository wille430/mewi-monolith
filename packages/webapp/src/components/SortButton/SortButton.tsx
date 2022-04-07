import { useAppSelector } from 'hooks/hooks'
import { useDispatch } from 'react-redux'
import { setSort } from 'store/search/creators'
import { Sort } from '@wille430/common/types'
import { useEffect } from 'react'

const SortButton = () => {
    const { sort } = useAppSelector((state) => state.search.filters)
    const dispatch = useDispatch()

    const options = [
        { label: 'Relevans', value: Sort.RELEVANCE },
        { label: 'Pris fallande', value: Sort.PRICE_DESC },
        { label: 'Pris stigande', value: Sort.PRICE_ASC },
        { label: 'Datum stigande', value: Sort.DATE_ASC },
        { label: 'Datum fallande', value: Sort.DATE_DESC },
    ]

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setSort(e.target.value as Sort))
    }

    useEffect(() => console.log(sort), [sort])

    return (
        <select
            onChange={handleChange}
            defaultValue={sort || Sort.RELEVANCE}
            value={sort || Sort.RELEVANCE}
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
