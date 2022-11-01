import { useState } from 'react'
import type { ListingSearchFilters } from '@/common/schemas'
import { ListingFilters } from '../ListingFilters/ListingFilters'
import { CreateWatcherButton } from '../CreateWatcherButton/CreateWatcherButton'
import { Container } from '../Container/Container'
import { HorizontalLine } from '../HorizontalLine/HorizontalLine'
import { Button } from '../Button/Button'
import { PopUp } from '@/components/PopUp/PopUp'

const AddWatcherPopUp = ({ useShow }: any) => {
    const { show, setShow } = useShow
    const [filters, setFilters] = useState<ListingSearchFilters>({})
    const [error, setError] = useState<string>('')

    const hidePopUp = () => {
        setShow(false)
    }

    return (
        <PopUp onOutsideClick={hidePopUp} show={show}>
            <div className='p-2 sm:mt-32'>
                <Container className='max-w-4xl sm:mx-auto' data-testid='addWatcherPopUp'>
                    <h3>Lägg till en bevakning</h3>
                    <HorizontalLine />
                    <div className='grid gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3'>
                        <ListingFilters showCategory {...{ filters, setFilters }} />
                    </div>
                    <footer className='flex justify-end pt-4'>
                        <div className='flex flex-col-reverse gap-2 sm:flex-row'>
                            <span className='text-red-400'>{error}</span>
                            <Button
                                label='Rensa filter'
                                color='error'
                                variant='outlined'
                                onClick={() => setFilters({})}
                            />
                            <CreateWatcherButton
                                onSuccess={() => {
                                    setShow(false)
                                    setFilters({})
                                }}
                                filters={filters}
                                setError={setError}
                            />
                        </div>
                    </footer>
                </Container>
            </div>
        </PopUp>
    )
}

export default AddWatcherPopUp
