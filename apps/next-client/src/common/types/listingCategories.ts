import {Category, CategoryLabel} from '@mewi/models'

export const listingCategories: {
    value: Category
    label: CategoryLabel
}[] = [
    {value: Category.AFFARSVERKSAMHET, label: CategoryLabel.AFFARSVERKSAMHET},
    {value: Category.ELEKTRONIK, label: CategoryLabel.ELEKTRONIK},
    {value: Category.FORDON, label: CategoryLabel.FORDON},
    {value: Category.FOR_HEMMET, label: CategoryLabel.FOR_HEMMET},
    {value: Category.FRITID_HOBBY, label: CategoryLabel.FRITID_HOBBY},
    {value: Category.OVRIGT, label: CategoryLabel.OVRIGT},
    {value: Category.PERSONLIGT, label: CategoryLabel.PERSONLIGT},
]
