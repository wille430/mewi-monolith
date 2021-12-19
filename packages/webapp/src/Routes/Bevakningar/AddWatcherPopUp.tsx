import PopUp from "common/components/PopUp"
import { useEffect, useState } from "react"
import FilterDropdown from "common/components/LabeledDropdown"
import { filters as staticFilters } from 'data'
import { categoriesOptions, regions } from "@mewi/types"
import ResetButton from "Routes/Search/FilterArea/ResetButton"
import AddWatcherButton from "Routes/Search/FilterArea/AddWatcherButton"
import PriceRangeFilter from "Routes/Search/FilterArea/PriceRangeFilter"
import { FilterFormDataProps } from "Routes/Search/FilterArea"
import Checkbox from "common/components/Checkbox"

const AddWatcherPopUp = ({ useShow }: any) => {

    const { show, setShow } = useShow

    const initFormData: FilterFormDataProps = {
        regions: [],
        category: "",
        isAuction: false,
        priceRange: {
            gte: "",
            lte: ""
        },
        keyword: ""
    }

    const [formData, setFormData] = useState(initFormData)

    const clearInputs = () => {
        console.log("Cleaing inputs")
        setFormData(initFormData)
    }

    const hidePopUp = (e: Event) => {
        if (e.target === e.currentTarget) {
            console.log('hide')
            setShow(false)
        }
    }

    return (
        <PopUp onOutsideClick={hidePopUp} show={show}>
            <div className="p-2 sm:mt-32">
                <section className="bg-blue rounded-md p-4 text-white shadow-md sm:mx-auto" style={{
                    maxWidth: '1000px'
                }}>
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex-grow">
                            <h2 className="pb-2 text-2xl">Filtrera:</h2>
                            <div className="grid gap-x-4 gap-y-6" style={{
                                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 200px)",
                            }}>
                                <div className="flex flex-col">
                                    <label className="inline-block h-10">Sök</label>
                                    <input
                                        className="input"
                                        placeholder="Sökord"
                                        onChange={e => setFormData({
                                            ...formData,
                                            keyword: e.target.value
                                        })}
                                        value={formData.keyword}
                                        data-testid="keywordInput"
                                    />
                                </div>

                                <FilterDropdown
                                    onChange={val => {
                                        setFormData({
                                            ...formData,
                                            regions: val
                                        })
                                    }}
                                    value={formData.regions}
                                    label="Välj region:"
                                    name="region"
                                    options={regions}
                                    isMulti
                                />

                                <FilterDropdown
                                    onChange={(val: string) => setFormData({
                                        ...formData,
                                        category: val
                                    })}
                                    label="Välj kategorier:"
                                    name="category"
                                    options={categoriesOptions}
                                    isMulti={false}
                                    value={formData.category}
                                />

                                <PriceRangeFilter
                                    gte={formData.priceRange.gte}
                                    lte={formData.priceRange.lte}
                                    onChange={(value, field) => {
                                        setFormData({
                                            ...formData,
                                            priceRange: {
                                                ...formData.priceRange,
                                                [field]: value
                                            }
                                        })
                                    }}
                                />

                                <div className="p-4">
                                    <Checkbox
                                        label="Auktion"
                                        name="isAuction"
                                        checked={formData.isAuction}
                                        onChange={(val) => {
                                            setFormData({
                                                ...formData,
                                                isAuction: val || false
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <ResetButton />
                    <AddWatcherButton
                        formData={formData}
                        onClick={clearInputs}
                        data-testid="sendButton"
                    />
                </section>
            </div>
        </PopUp>
    )
}

export default AddWatcherPopUp