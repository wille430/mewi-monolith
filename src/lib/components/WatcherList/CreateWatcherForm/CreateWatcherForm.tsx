import { createUserWatcher } from '@/lib/client/user-watchers/mutations'
import { createUserWatcherSchema } from '@/lib/client/user-watchers/schemas/create-user-watcher.schema'
import { useAppSelector } from '@/lib/hooks'
import type { WatcherMetadata } from '@/lib/modules/schemas/class/WatcherMetadata'
import type { CreateUserWatcherDto } from '@/lib/modules/user-watchers/dto/create-user-watcher.dto'
import { ErrorMessage, Form, Formik } from 'formik'
import type { FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'
import { Button } from '../../Button/Button'
import { ConfirmModal } from '../../ConfirmModal/ConfirmModal'
import { handleError } from './handleError'
import { ListingSearchForm } from '../../ListingSearchForm/ListingSearchForm'

const initialValues: CreateUserWatcherDto['metadata'] = {}

export type CreateWatcherFormProps = {
    onSuccess?: () => any
}

export const CreateWatcherForm = (props: CreateWatcherFormProps) => {
    const { onSuccess } = props
    const { mutate } = useSWRConfig()

    const router = useRouter()
    const { isLoggedIn } = useAppSelector((state) => state.user)

    const handleSubmit = (
        values: typeof initialValues,
        { setErrors }: FormikHelpers<WatcherMetadata>
    ) =>
        mutate(
            ...createUserWatcher({
                metadata: values,
            })
        )
            .then(() => onSuccess && onSuccess())
            .catch((e) => setErrors(handleError(e)))

    return (
        <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={createUserWatcherSchema}
        >
            {({ resetForm, submitForm }) => (
                <Form>
                    <ListingSearchForm />

                    {/* <div className='px-4 pt-4 pb-2'>
                        <Checkbox
                            label='Auktion'
                            name='auction'
                            onClick={(val: any) =>
                                setFilters({
                                    ...filters,
                                    auction: val,
                                })
                            }
                            checked={filters.auction}
                            data-testid='auctionCheckbox'
                        />
                    </div> */}

                    <footer className='flex justify-end pt-4'>
                        <ErrorMessage name='all' />
                        <div className='flex flex-col-reverse gap-2 sm:flex-row'>
                            {/* <span className='text-red-400'>{error}</span> */}
                            <Button
                                label='Rensa filter'
                                color='error'
                                type='button'
                                variant='outlined'
                                onClick={() => resetForm}
                            />
                            <ConfirmModal
                                modalProps={{
                                    heading:
                                        'Är du säker att du vill lägga en bevakning på sökningen?',
                                    bodyText:
                                        'Genom att klicka på "Ja" godkänner du att ta emot e-post varje gång det kommer nya föremål som matchar din sökning.',
                                    onAccept: submitForm,
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
                        </div>
                    </footer>
                </Form>
            )}
        </Formik>
    )
}
