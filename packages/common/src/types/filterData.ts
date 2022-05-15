import { Category } from '@mewi/prisma/index-browser'
import { CategoryLabel } from './category.enum'

export const regions = [
    { value: 'norrbotten', label: 'Norrbotten' },
    { value: 'västerbotten', label: 'Västerbotten' },
    { value: 'jämtland', label: 'Jämtland' },
    { value: 'västernorrland', label: 'Västernorrland' },
    { value: 'gävleborg', label: 'Gävleborg' },
    { value: 'dalarna', label: 'Dalarna' },
    { value: 'värmland', label: 'Värmland' },
    { value: 'örebro', label: 'Örebro' },
    { value: 'västmanland', label: 'Västmanland' },
    { value: 'uppsala', label: 'Uppsala' },
    { value: 'stockholm', label: 'Stockholm' },
    { value: 'södermanland', label: 'Södermanland' },
    { value: 'skaraborg', label: 'Skaraborg' },
    { value: 'östergötland', label: 'Östergötland' },
    { value: 'göteborg', label: 'Göteborg' },
    { value: 'älvsborg', label: 'Älvsborg' },
    { value: 'jönköping', label: 'Jönköping' },
    { value: 'kalmar', label: 'Kalmar' },
    { value: 'gotland', label: 'Gotland' },
    { value: 'halland', label: 'Halland' },
    { value: 'kronoberg', label: 'Kronoberg' },
    { value: 'blekinge', label: 'Blekinge' },
    { value: 'skåne', label: 'Skåne' },
]

export const categories: {
    value: Category
    label: CategoryLabel
}[] = [
    { value: Category.AFFARSVERKSAMHET, label: CategoryLabel.AFFARSVERKSAMHET },
    { value: Category.ELEKTRONIK, label: CategoryLabel.ELEKTRONIK },
    { value: Category.FORDON, label: CategoryLabel.FORDON },
    { value: Category.FOR_HEMMET, label: CategoryLabel.FOR_HEMMET },
    { value: Category.FRITID_HOBBY, label: CategoryLabel.FRITID_HOBBY },
    { value: Category.OVRIGT, label: CategoryLabel.OVRIGT },
    { value: Category.PERSONLIGT, label: CategoryLabel.PERSONLIGT },
]
