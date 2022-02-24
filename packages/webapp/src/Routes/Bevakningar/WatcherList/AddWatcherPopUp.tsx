import PopUp from 'components/PopUp/ index'
import { useState } from 'react'
import { SearchFilterDataProps } from '@mewi/types'
import ResetButton from 'components/SearchFilterArea/ResetButton'
import AddWatcherButton from 'components/SearchFilterArea/AddWatcherButton'
import SearchFilterContent from 'components/SearchFilterArea/SearchFilterContent'
import _ from 'lodash'

const AddWatcherPopUp = ({ useShow }: any) => {
    const { show, setShow } = useShow

    const [formData, setFormData] = useState<SearchFilterDataProps>({
        keyword: '',
    })

    const clearInputs = () => {
        setFormData({
            keyword: '',
        })
    }

    const hidePopUp = () => {
        setShow(false)
    }

    return (
        <PopUp onOutsideClick={hidePopUp} show={show}>
            <div className='p-2 sm:mt-32'>
                <section
                    className='rounded-md bg-white p-4 text-black shadow-md sm:mx-auto'
                    style={{
                        maxWidth: '1000px',
                    }}
                    data-testid='addWatcherPopUp'
                >
                    <SearchFilterContent
                        searchFilterData={formData}
                        onChange={(key, value) => {
                            setFormData((prevState) => ({
                                ...prevState,
                                [key]: value,
                            }))
                        }}
                        onValueDelete={(key) => {
                            setFormData((prevState) => _.omit(prevState, key))
                        }}
                        onReset={() => setFormData({ keyword: '' })}
                        showKeywordField={true}
                        heading='Lägg till en bevakning:'
                    />
                    <footer className='flex justify-end pt-4'>
                        <div className='flex flex-col-reverse gap-2 sm:flex-row'>
                            <ResetButton onClick={clearInputs} />
                            <AddWatcherButton
                                searchFilters={formData}
                                onClick={() => {
                                    setShow(false)
                                    clearInputs()
                                }}
                                data-testid='sendButton'
                            />
                        </div>
                    </footer>
                </section>
            </div>
        </PopUp>
    )
}

export default AddWatcherPopUp
