import React from 'react'
import { useAppSelector } from 'hooks/hooks'
import { useDispatch } from 'react-redux'
import { setSort } from 'store/search/creators'
import { SortData } from '@mewi/types'
import { useHistory, useLocation } from 'react-router'
import queryString from 'query-string'

const SortButton = () => {
    const { sort } = useAppSelector((state) => state.search)
    const dispatch = useDispatch()

    const history = useHistory()
    const location = useLocation()

    const options = [
        { label: 'Relevans', value: SortData.RELEVANCE, default: { selected: true } },
        { label: 'Pris fallande', value: SortData.PRICE_DESC, default: { selected: false } },
        { label: 'Pris stigande', value: SortData.PRICE_ASC, default: { selected: false } },
        { label: 'Datum stigande', value: SortData.DATE_ASC, default: { selected: false } },
        { label: 'Datum fallande', value: SortData.DATE_DESC, default: { selected: false } },
    ]

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setSort(e.target.value as SortData))
        history.push({
            pathname: window.location.pathname,
            search: queryString.stringify({
                ...new URLSearchParams(location.search),
                sort,
            }),
        })
    }

    return (
        <select onChange={handleChange} value={sort}>
            {options.map((obj, i) => (
                <option key={i} value={obj.value}>
                    {obj.label}
                </option>
            ))}
        </select>
    )
}

export default SortButton
