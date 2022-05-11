import { PopUp } from '@/components/PopUp/PopUp'
import { useState } from 'react'
import { ListingSearchFilters, PopulatedUserWatcher } from '@wille430/common'
import { ListingFilters } from '../ListingFilters/ListingFilters'
import { Button, Container, HorizontalLine } from '@mewi/ui'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { useAppDispatch } from '@/hooks'
import { PopUpModal } from '../PopUpModal/PopUpModal'
import { pushToSnackbar } from '@/store/snackbar'

const AddWatcherPopUp = ({ useShow }: any) => {
    const { show, setShow } = useShow
    const [showModal, setShowModal] = useState(false)
    const [filters, setFilters] = useState<ListingSearchFilters>({})
    const [error, setError] = useState<string>('')

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()

    const mutation = useMutation(
        async (newWatcher: ListingSearchFilters) => {
            return axios
                .post<PopulatedUserWatcher>('/users/me/watchers', { metadata: newWatcher })
                .then((res) => res.data)
        },
        {
            onMutate: () => setError(''),
            onError: (error: any) => {
                switch (error.status) {
                    case 422:
                    case 400:
                        error = 'Felaktigt filter'
                        break
                    case 409:
                        error = 'En bevakning med samma sökning finns redan'
                        break
                    default:
                        error = 'Ett fel inträffade'
                }

                setError(error)
                setShowModal(false)
            },
            onSuccess: (data) => {
                setShow(false)
                setFilters({})
                setShowModal(false)
                dispatch(pushToSnackbar({ title: 'Bevakningar lades till!' }))

                queryClient.setQueryData('watchers', (old?: PopulatedUserWatcher[]) => [
                    ...(old ?? []),
                    data,
                ])
            },
        }
    )

    const hidePopUp = () => {
        setShow(false)
    }

    return (
        <PopUp onOutsideClick={hidePopUp} show={show}>
            <div className='p-2 sm:mt-32'>
                <Container className='sm:mx-auto max-w-4xl' data-testid='addWatcherPopUp'>
                    <h3>Lägg till en bevakning</h3>
                    <HorizontalLine />
                    <div className='grid gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3'>
                        <ListingFilters {...{ filters, setFilters }} />
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
                            <Button
                                label='Lägg till bevakning'
                                color='primary'
                                onClick={() => {
                                    setShowModal(true)
                                }}
                                disabled={mutation.isLoading}
                                data-testid='sendButton'
                            />
                            <PopUpModal
                                heading='Är du säker att du vill lägga en bevakning på sökningen?'
                                bodyText='Genom att klicka på "Ja" godkänner du att ta emot e-post varje gång det kommer nya föremål som matchar din sökning.'
                                onExit={() => setShowModal(false)}
                                open={showModal}
                                onAccept={() => mutation.mutate(filters)}
                            />
                        </div>
                    </footer>
                </Container>
            </div>
        </PopUp>
    )
}

export default AddWatcherPopUp
