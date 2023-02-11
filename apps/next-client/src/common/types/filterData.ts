import {Category, CategoryLabel} from '../schemas'

export const categories: {
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
