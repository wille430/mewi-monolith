import { useEffect, useState } from 'react'
import useParam from 'common/hooks/useParam'

const SortButton = () => {
    const [param, setParam] = useParam('sort')

    const options = [
        { label: 'Relevans', name: 'relevans', default: { selected: true } },
        { label: 'Pris fallande', name: 'pris_fallande', default: { selected: false } },
        { label: 'Pris stigande', name: 'pris_stigande', default: { selected: false } },
        { label: 'Datum stigande', name: 'datum_stigande', default: { selected: false } },
        { label: 'Datum fallande', name: 'datum_fallande', default: { selected: false } },
    ]

    const [selectedOption, setSelectedOption] = useState(options[0].name)

    const onSortChange = (e: any) => {
        setSelectedOption(e.target.value)
    }

    useEffect(() => {
        if (!param) return
        setSelectedOption(param)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!selectedOption || selectedOption === options[0].name) {
            setParam(null)
        } else {
            setParam(selectedOption)
        }
        // eslint-disable-next-line
    }, [selectedOption])

    return (
        <select onChange={onSortChange} value={selectedOption}>
            {options.map((obj, i) => (
                <option key={i} value={obj.name}>
                    {obj.label}
                </option>
            ))}
        </select>
    )
}

export default SortButton
