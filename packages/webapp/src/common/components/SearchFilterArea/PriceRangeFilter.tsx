import { PriceRange } from "@mewi/types"

export interface PriceRangeFilterProps {
    gte?: PriceRange["gte"],
    lte?: PriceRange["lte"],
    onChange?: (field: 'gte' | 'lte', value?: string) => void
}

const PriceRangeFilter = (props: PriceRangeFilterProps) => {

    const { onChange, gte, lte } = props

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'gte' | 'lte') => {
        if (e.target.value) {
            const value = parseInt(e.target.value).toString()
            onChange && onChange(field, value)
        } else {
            onChange && onChange(field)
        }
    }

    return (
        <div>
            <label className="text-white h-10 inline-block">Välj prisintervall:</label>
            <div className="flex flex-col space-y-3 text-black">
                <input className="input" value={gte} placeholder="Från (kr)" onChange={e => onInputChange(e, "gte")}></input>
                <input className="input" value={lte} placeholder="Till (kr)" onChange={e => onInputChange(e, "lte")}></input>
            </div>
        </div>
    );
}

export default PriceRangeFilter