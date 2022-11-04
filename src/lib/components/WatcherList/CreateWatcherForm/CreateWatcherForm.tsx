import { createUserWatcher } from '@/lib/client/user-watchers/mutations'
import { createUserWatcherSchema } from '@/lib/client/user-watchers/schemas/create-user-watcher.schema'
import { useAppSelector } from '@/lib/hooks'
import type { WatcherMetadata } from '@/lib/modules/schemas/class/WatcherMetadata'
import type { CreateUserWatcherDto } from '@/lib/modules/user-watchers/dto/create-user-watcher.dto'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import type { FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'
import { Button } from '../../Button/Button'
import { ConfirmModal } from '../../ConfirmModal/ConfirmModal'
import { LabeledTextField } from '../../LabeledTextField/LabeledTextField'
import { handleError } from './handleError'
import LabeledDropdown from '../../LabeledDropdown/LabeledDropdown'
import { categories } from '@/common/types'
import { Category } from '@/common/schemas'

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
            {({ setFieldValue, resetForm, submitForm }) => (
                <Form>
                    <Field
                        label='Sökord'
                        as={LabeledTextField}
                        placeholder='Filtrera efter produktnamn...'
                        showLabel={false}
                        name='keyword'
                        data-testid='keywordInput'
                        fullWidth
                    />
                    <ErrorMessage name='keyword' />

                    <Field
                        label='Plats'
                        as={LabeledTextField}
                        placeholder='Plats (stad, region, etc)'
                        name='region'
                        showLabel={false}
                        data-testid='regionInput'
                        fullWidth
                    />
                    <ErrorMessage name='region' />

                    <Field
                        label='Kategori'
                        as={LabeledDropdown}
                        name='categories'
                        onChange={(cats: Category[]) => {
                            setFieldValue('categories', cats)
                        }}
                        isMulti
                        options={categories}
                        data-testid='categorySelect'
                    />
                    <ErrorMessage name='categories' />

                    <Field
                        as={LabeledTextField}
                        name='priceRangeGte'
                        placeholder='Från (kr)'
                        onReset={() => setFieldValue('priceRangeGte', undefined)}
                        showClearButton
                        fullWidth
                        type='number'
                        data-testid='priceGte'
                    />
                    <ErrorMessage name='priceRangeGte' />

                    <Field
                        as={LabeledTextField}
                        name='priceRangeLte'
                        placeholder='Till (kr)'
                        onReset={() => setFieldValue('priceRangeLte', undefined)}
                        showClearButton
                        fullWidth
                        type='number'
                        data-testid='priceLte'
                    />
                    <ErrorMessage name='priceRangeLte' />

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
