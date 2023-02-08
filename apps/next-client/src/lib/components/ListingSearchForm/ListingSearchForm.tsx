import { Category, ListingOrigin } from '@/common/schemas'
import { ErrorMessage, Field, useFormikContext } from 'formik'
import LabeledDropdown from '../LabeledDropdown/LabeledDropdown'
import { LabeledTextField } from '../LabeledTextField/LabeledTextField'
import { categories, ListingSearchFilters } from '@/common/types'
import { TextField } from '../TextField/TextField'
import { FormikCheckboxList } from '../FormikCheckboxList/FormikCheckboxList'
import { useMemo } from 'react'
import Checkbox from '../Checkbox/Checkbox'

export type ListingSearchFormProps = {
    fieldTypes?: Partial<Record<keyof ListingSearchFilters, 'LIST' | 'DROPDOWN' | boolean>>
}

export const ListingSearchForm = (props: ListingSearchFormProps) => {
    const { fieldTypes = { categories: 'DROPDOWN', origins: 'DROPDOWN' } } = props
    const { setFieldValue, values } = useFormikContext<ListingSearchFilters>()

    const origins = useMemo(() => {
        return Object.keys(ListingOrigin).map((val) => ({
            label: val,
            value: val,
        }))
    }, [])

    return (
        <>
            {fieldTypes.keyword === false ? undefined : (
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
                </>
            )}

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

            {fieldTypes.categories === 'LIST' ? (
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

            {fieldTypes.origins === 'DROPDOWN' ? (
                <Field
                    label='Sajter'
                    as={LabeledDropdown}
                    name='origins'
                    onChange={(origins: ListingOrigin[]) => {
                        setFieldValue('origins', origins)
                    }}
                    isMulti
                    options={origins}
                    data-testid='originsSelect'
                />
            ) : (
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
            )}

            <div className='px-2 pt-4 pb-2'>
                <Checkbox
                    label='Auktion'
                    name='auction'
                    onClick={(val: any) =>
                        // TODO: use a tri-state checkbox instead
                        setFieldValue('auction', val === false ? undefined : val)
                    }
                    checked={values.auction}
                    data-testid='auctionCheckbox'
                />
            </div>
        </>
    )
}
