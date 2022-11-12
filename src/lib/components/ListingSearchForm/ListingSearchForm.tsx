import { Category, ListingOrigin } from '@/common/schemas'
import { ErrorMessage, Field, useFormikContext } from 'formik'
import LabeledDropdown from '../LabeledDropdown/LabeledDropdown'
import { LabeledTextField } from '../LabeledTextField/LabeledTextField'
import { categories, ListingSearchFilters } from '@/common/types'
import { TextField } from '../TextField/TextField'
import { FormikCheckboxList } from '../FormikCheckboxList/FormikCheckboxList'

export type ListingSearchFormProps = {
    categoryField?: 'LIST' | 'DROPDOWN'
}

export const ListingSearchForm = (props: ListingSearchFormProps) => {
    const { categoryField } = props
    const { setFieldValue } = useFormikContext<ListingSearchFilters>()

    return (
        <>
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

            {categoryField === 'LIST' ? (
                <div>
                    <h4>Kategorier</h4>
                    <FormikCheckboxList name='categories' options={categories} />
                </div>
            ) : (
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
            )}
            <ErrorMessage name='categories' />

            <div className='space-y-2'>
                <h4>Prisintervall</h4>

                <Field
                    as={TextField}
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
                    as={TextField}
                    name='priceRangeLte'
                    placeholder='Till (kr)'
                    onReset={() => setFieldValue('priceRangeLte', undefined)}
                    showClearButton
                    fullWidth
                    type='number'
                    data-testid='priceLte'
                />
                <ErrorMessage name='priceRangeLte' />
            </div>

            <div>
                <h4>Sajter</h4>
                <FormikCheckboxList
                    name='origins'
                    options={Object.values(ListingOrigin).map((key) => ({
                        value: key,
                        label: undefined,
                    }))}
                />
            </div>
        </>
    )
}
