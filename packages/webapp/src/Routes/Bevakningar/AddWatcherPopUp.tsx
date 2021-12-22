import PopUp from 'common/components/PopUp'
import { useState } from 'react'
import { SearchFilterDataProps } from '@mewi/types'
import ResetButton from 'common/components/SearchFilterArea/ResetButton'
import AddWatcherButton from 'common/components/SearchFilterArea/AddWatcherButton'
import SearchFilterContent from 'common/components/SearchFilterArea/SearchFilterContent'

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

    const hidePopUp = (e: Event) => {
        if (e.target === e.currentTarget) {
            console.log('hide')
            setShow(false)
        }
    }

    return (
        <PopUp onOutsideClick={hidePopUp} show={show}>
            <div className='p-2 sm:mt-32'>
                <section
                    className='bg-blue rounded-md p-4 text-white shadow-md sm:mx-auto'
                    style={{
                        maxWidth: '1000px',
                    }}
                    data-testid='addWatcherPopUp'
                >
                    <SearchFilterContent
                        searchFilterData={formData}
                        setSearchFilterData={(newData) => {
                            setFormData(newData)
                        }}
                        showKeywordField={true}
                        heading='Lägg till en bevakning:'
                    />
                    <ResetButton onClick={clearInputs} />
                    <AddWatcherButton
                        searchFilters={formData}
                        onClick={() => {
                            setShow(false)
                            clearInputs()
                        }}
                        data-testid='sendButton'
                    />
                </section>
            </div>
        </PopUp>
    )
}

export default AddWatcherPopUp
