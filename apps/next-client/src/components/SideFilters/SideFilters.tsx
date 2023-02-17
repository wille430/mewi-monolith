import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Container } from '../Container/Container'
import { Button } from '../Button/Button'
import { ListingSearchFilters } from '@/common/types/ListingSearchFilters'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { mutate } from 'swr'
import { createUserWatcher } from '@/client/user-watchers/mutations'
import { useAppSelector } from '@/hooks'
import { useRouter } from 'next/router'
import { useSearchContext } from '@/hooks/useSearch'
import { ListingSearchForm } from '../ListingSearchForm/ListingSearchForm'

export const SideFilters = () => {
    const {
        filters,
        formik: { resetForm },
    } = useSearchContext<ListingSearchFilters>()
    const { isLoggedIn } = useAppSelector((state) => state.user)
    const router = useRouter()
    const [addWatcherStatus, setAddWatcherStatus] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        setAddWatcherStatus(undefined)
    }, [filters])

    return (
        <aside className='md'>
            <Container className='flex space-y-4'>
                <h4>Filtrera</h4>

                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:block md:space-y-4'>
                    <ListingSearchForm
                        fieldTypes={{
                            keyword: false,
                            categories: 'LIST',
                            origins: 'LIST',
                        }}
                    />
                </div>

                <div className='flex flex-col justify-end space-y-2'>
                    <Button label='Rensa' onClick={() => resetForm()} />
                    <ConfirmModal
                        modalProps={{
                            heading: 'Är du säker att du vill lägga en bevakning på sökningen?',
                            bodyText:
                                'Genom att klicka på "Ja" godkänner du att ta emot e-post varje gång det kommer nya föremål som matchar din sökning.',
                            onAccept: () =>
                                mutate(...createUserWatcher({ metadata: filters }))
                                    .then(() => setAddWatcherStatus(true))
                                    .catch(() => setAddWatcherStatus(false)),
                        }}
                    >
                        {({ showModal }) => (
                            <Button
                                label='Lägg till bevakning'
                                type='button'
                                color='primary'
                                onClick={async () => {
                                    if (isLoggedIn) {
                                        showModal()
                                    } else {
                                        await router.push('/loggain')
                                    }
                                }}
                                data-testid='addWatcherButton'
                            />
                        )}
                    </ConfirmModal>
                    <span
                        className={clsx([
                            addWatcherStatus === true ? 'text-green-400' : 'text-red-400',
                            addWatcherStatus === undefined && 'hidden',
                        ])}
                    >
                        {addWatcherStatus
                            ? 'Bevakningen lades till!'
                            : 'Kunde inte lägga till bevakning. Försök igen senare.'}
                    </span>
                </div>
            </Container>
        </aside>
    )
}
