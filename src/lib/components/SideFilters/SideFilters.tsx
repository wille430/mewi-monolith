import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Container } from '../Container/Container'
import { Button } from '../Button/Button'
import { ListingSearchFilters } from '@/common/types'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { mutate } from 'swr'
import { createUserWatcher } from '@/lib/client/user-watchers/mutations'
import { useAppSelector } from '@/lib/hooks'
import { useRouter } from 'next/router'
import { useSearchContext } from '@/lib/hooks/useSearch'
import { Formik } from 'formik'
import { ListingSearchForm } from '../ListingSearchForm/ListingSearchForm'
import { noop } from 'lodash'
import { useSyncValues } from '@/lib/hooks/useSyncValues'

export const SideFilters = () => {
    const { filters, setFilters, clear } = useSearchContext<ListingSearchFilters>()
    const { isLoggedIn } = useAppSelector((state) => state.user)
    const router = useRouter()
    const [addWatcherStatus, setAddWatcherStatus] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        setAddWatcherStatus(undefined)
    }, [filters])

    return (
        <aside className='ml-auto md:max-w-xxs'>
            <Container className='flex space-y-4'>
                <h3>Filter</h3>

                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:block md:space-y-4'>
                    <Formik initialValues={filters} onSubmit={noop}>
                        {({ values, setValues }) => {
                            useSyncValues([values, setValues], [filters, setFilters])

                            return <ListingSearchForm categoryField='LIST' />
                        }}
                    </Formik>
                </div>

                <div className='flex flex-col justify-end space-y-2'>
                    <Button label='Rensa' onClick={clear} />
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
                                onClick={() => {
                                    if (isLoggedIn) {
                                        showModal()
                                    } else {
                                        router.push('/loggain')
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
