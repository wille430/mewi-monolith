import { Sort } from './sort.enum'

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

export const sortableFields: Record<Sort, Record<string, number>> = {
    relevance: {},
    price_desc: { 'price.value': -1 },
    price_asc: { 'price.value': 1 },
    date_asc: { date: 1 },
    date_desc: { date: -1 },
}
