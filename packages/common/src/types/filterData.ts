// export interface Category {
//     _id: string
//     label: string
//     subcat: CategoryHash
// }

// export interface CategoryHash {
//     [key: string]: Category
// }

// export const categories: CategoryHash = {
//     fordon: {
//         _id: '61366a5106116ee385a56b17',
//         label: 'Fordon',
//         subcat: {
//             bilar: {
//                 _id: '6138ed961848c7da4db9a4f0',
//                 label: 'Bilar',
//                 subcat: {},
//             },
//             båtar: {
//                 _id: '6138ed961848c7da4db9a4f2',
//                 label: 'Båtar',
//                 subcat: {},
//             },
//             bildelar_biltillbehör: {
//                 _id: '6138ed961848c7da4db9a4f1',
//                 label: 'Bildelar & biltillbehör',
//                 subcat: {},
//             },
//             mopeder: {
//                 _id: '6138ed961848c7da4db9a4f5',
//                 label: 'Mopeder',
//                 subcat: {},
//             },
//             båtdelar_tillbehör: {
//                 _id: '6138ed961848c7da4db9a4f3',
//                 label: 'Båtdelar & tillbehör',
//                 subcat: {},
//             },
//             husvagnar_husbilar: {
//                 _id: '6138ed961848c7da4db9a4f4',
//                 label: 'Husvagnar & husbilar',
//                 subcat: {},
//             },
//             'mc-delar': {
//                 _id: '6138ed961848c7da4db9a4f8',
//                 label: 'MC-delar',
//                 subcat: {},
//             },
//             'a-traktor': {
//                 _id: '6138ed961848c7da4db9a4f6',
//                 label: 'A-traktor',
//                 subcat: {},
//             },
//             lastbil_truck_entreprenad: {
//                 _id: '6138ed961848c7da4db9a4f9',
//                 label: 'Lastbil, truck & entreprenad',
//                 subcat: {},
//             },
//             motorcyklar: {
//                 _id: '6138ed961848c7da4db9a4f7',
//                 label: 'Motorcyklar',
//                 subcat: {},
//             },
//             snöskotrar: {
//                 _id: '6138ed961848c7da4db9a4fb',
//                 label: 'Snöskotrar',
//                 subcat: {},
//             },
//             snöskoterdelar: {
//                 _id: '6138ed961848c7da4db9a4fc',
//                 label: 'Snöskoterdelar',
//                 subcat: {},
//             },
//         },
//     },
//     för_hemmet: {
//         _id: '6138eb92163f13592bfd0c38',
//         label: 'För hemmet',
//         subcat: {
//             bygg_trädgård: {
//                 _id: '6138edb7d7f1768a965f239d',
//                 label: 'Bygg & trädgård',
//                 subcat: {},
//             },
//             husgeråd_vitvaror: {
//                 _id: '6138edb7d7f1768a965f239f',
//                 label: 'Husgeråd & vitvaror',
//                 subcat: {},
//             },
//             möbler_hemindredning: {
//                 _id: '6138edb7d7f1768a965f239e',
//                 label: 'Möbler & hemindredning',
//                 subcat: {},
//             },
//             verktyg: {
//                 _id: '6138edb7d7f1768a965f23a0',
//                 label: 'Verktyg',
//                 subcat: {},
//             },
//         },
//     },
//     bostad: {
//         _id: '6138eb92163f13592bfd0c39',
//         label: 'Bostad',
//         subcat: {
//             lägenheter: {
//                 _id: '6138edd642f67c68a716fdee',
//                 label: 'Lägenheter',
//                 subcat: {},
//             },
//             villor: {
//                 _id: '6138edd642f67c68a716fdef',
//                 label: 'Villor',
//                 subcat: {},
//             },
//             radhus: {
//                 _id: '6138edd642f67c68a716fdf0',
//                 label: 'Radhus',
//                 subcat: {},
//             },
//             tomter: {
//                 _id: '6138edd642f67c68a716fdf1',
//                 label: 'Tomter',
//                 subcat: {},
//             },
//             gårdar: {
//                 _id: '6138edd642f67c68a716fdf2',
//                 label: 'Gårdar',
//                 subcat: {},
//             },
//             fritidsboende: {
//                 _id: '6138edd642f67c68a716fdf3',
//                 label: 'Fritidsboende',
//                 subcat: {},
//             },
//             utland: {
//                 _id: '6138edd642f67c68a716fdf4',
//                 label: 'Utland',
//                 subcat: {},
//             },
//         },
//     },
//     personligt: {
//         _id: '6138eb92163f13592bfd0c3a',
//         label: 'Personligt',
//         subcat: {
//             kläder_skor: {
//                 _id: '6138ee31f39ac37b8acccb3a',
//                 label: 'Kläder & skor',
//                 subcat: {},
//             },
//             accessoarer_klockor: {
//                 _id: '6138ee31f39ac37b8acccb3b',
//                 label: 'Accessoarer & klockor',
//                 subcat: {},
//             },
//             barnartiklar_leksaker: {
//                 _id: '6138ee31f39ac37b8acccb3d',
//                 label: 'Barnartiklar & leksaker',
//                 subcat: {},
//             },
//             barnkläder_skor: {
//                 _id: '6138ee31f39ac37b8acccb3c',
//                 label: 'Barnkläder & skor',
//                 subcat: {},
//             },
//         },
//     },
//     elektronik: {
//         _id: '6138eb92163f13592bfd0c3b',
//         label: 'Elektronik',
//         subcat: {
//             'datorer_tv-spel': {
//                 _id: '6138ee7a2e0764c2b9f40e39',
//                 label: 'Datorer & TV-spel',
//                 subcat: {},
//             },
//             ljud_bild: {
//                 _id: '6138ee7a2e0764c2b9f40e3a',
//                 label: 'Ljud & bild',
//                 subcat: {},
//             },
//             telefoner_tillbehör: {
//                 _id: '6138ee7a2e0764c2b9f40e3b',
//                 label: 'Telefoner & tillbehör',
//                 subcat: {},
//             },
//         },
//     },
//     fritid_hobby: {
//         _id: '6138eb92163f13592bfd0c3c',
//         label: 'Fritid & hobby',
//         subcat: {
//             upplevelser_nöje: {
//                 _id: '6138ee8d2c4f0b665e4c59ac',
//                 label: 'Upplevelser & nöje',
//                 subcat: {},
//             },
//             böcker_studentlitteratur: {
//                 _id: '6138ee8d2c4f0b665e4c59ad',
//                 label: 'Böcker & studentlitteratur',
//                 subcat: {},
//             },
//             cyklar: {
//                 _id: '6138ee8d2c4f0b665e4c59ae',
//                 label: 'Cyklar',
//                 subcat: {},
//             },
//             djur: {
//                 _id: '6138ee8d2c4f0b665e4c59af',
//                 label: 'Djur',
//                 subcat: {},
//             },
//             hobby_samlarprylar: {
//                 _id: '6138ee8d2c4f0b665e4c59b0',
//                 label: 'Hobby & samlarprylar',
//                 subcat: {},
//             },
//             hästar_ridsport: {
//                 _id: '6138ee8d2c4f0b665e4c59b1',
//                 label: 'Hästar & ridsport',
//                 subcat: {},
//             },
//             jakt_fiske: {
//                 _id: '6138ee8d2c4f0b665e4c59b2',
//                 label: 'Jakt & fiske',
//                 subcat: {},
//             },
//             musikutrustning: {
//                 _id: '6138ee8d2c4f0b665e4c59b3',
//                 label: 'Musikutrustning',
//                 subcat: {},
//             },
//             'sport-_fritidsutrustning': {
//                 _id: '6138ee8d2c4f0b665e4c59b4',
//                 label: 'Sport- & fritidsutrustning',
//                 subcat: {},
//             },
//         },
//     },
//     affärsverksamhet: {
//         _id: '6138eb92163f13592bfd0c3d',
//         label: 'Affärsverksamhet',
//         subcat: {
//             affärsöverlåtelser: {
//                 _id: '6138eea3c70d6b471d06ffc8',
//                 label: 'Affärsöverlåtelser',
//                 subcat: {},
//             },
//             inventarier_maskiner: {
//                 _id: '6138eea3c70d6b471d06ffc9',
//                 label: 'Inventarier & maskiner',
//                 subcat: {},
//             },
//             lokaler_fastigheter: {
//                 _id: '6138eea3c70d6b471d06ffca',
//                 label: 'Lokaler & fastigheter',
//                 subcat: {},
//             },
//             tjänster: {
//                 _id: '6138eea3c70d6b471d06ffcb',
//                 label: 'Tjänster',
//                 subcat: {},
//             },
//         },
//     },
//     övrigt: {
//         _id: '6138eb92163f13592bfd0c3e',
//         label: 'Övrigt',
//         subcat: {},
//     },
// }

export const categoriesOptions = [
    {
        value: 'fordon',
        label: 'Fordon',
    },
    {
        value: 'bilar',
        label: ' - Bilar',
    },
    {
        value: 'båtar',
        label: ' - Båtar',
    },
    {
        value: 'bildelar_biltillbehör',
        label: ' - Bildelar & biltillbehör',
    },
    {
        value: 'mopeder',
        label: ' - Mopeder',
    },
    {
        value: 'båtdelar_tillbehör',
        label: ' - Båtdelar & tillbehör',
    },
    {
        value: 'husvagnar_husbilar',
        label: ' - Husvagnar & husbilar',
    },
    {
        value: 'mc-delar',
        label: ' - MC-delar',
    },
    {
        value: 'a-traktor',
        label: ' - A-traktor',
    },
    {
        value: 'lastbil_truck_entreprenad',
        label: ' - Lastbil, truck & entreprenad',
    },
    {
        value: 'motorcyklar',
        label: ' - Motorcyklar',
    },
    {
        value: 'snöskotrar',
        label: ' - Snöskotrar',
    },
    {
        value: 'snöskoterdelar',
        label: ' - Snöskoterdelar',
    },
    {
        value: 'för_hemmet',
        label: 'För hemmet',
    },
    {
        value: 'bygg_trädgård',
        label: ' - Bygg & trädgård',
    },
    {
        value: 'husgeråd_vitvaror',
        label: ' - Husgeråd & vitvaror',
    },
    {
        value: 'möbler_hemindredning',
        label: ' - Möbler & hemindredning',
    },
    {
        value: 'verktyg',
        label: ' - Verktyg',
    },
    {
        value: 'bostad',
        label: 'Bostad',
    },
    {
        value: 'lägenheter',
        label: ' - Lägenheter',
    },
    {
        value: 'villor',
        label: ' - Villor',
    },
    {
        value: 'radhus',
        label: ' - Radhus',
    },
    {
        value: 'tomter',
        label: ' - Tomter',
    },
    {
        value: 'gårdar',
        label: ' - Gårdar',
    },
    {
        value: 'fritidsboende',
        label: ' - Fritidsboende',
    },
    {
        value: 'utland',
        label: ' - Utland',
    },
    {
        value: 'personligt',
        label: 'Personligt',
    },
    {
        value: 'kläder_skor',
        label: ' - Kläder & skor',
    },
    {
        value: 'accessoarer_klockor',
        label: ' - Accessoarer & klockor',
    },
    {
        value: 'barnartiklar_leksaker',
        label: ' - Barnartiklar & leksaker',
    },
    {
        value: 'barnkläder_skor',
        label: ' - Barnkläder & skor',
    },
    {
        value: 'elektronik',
        label: 'Elektronik',
    },
    {
        value: 'datorer_tv-spel',
        label: ' - Datorer & TV-spel',
    },
    {
        value: 'ljud_bild',
        label: ' - Ljud & bild',
    },
    {
        value: 'telefoner_tillbehör',
        label: ' - Telefoner & tillbehör',
    },
    {
        value: 'fritid_hobby',
        label: 'Fritid & hobby',
    },
    {
        value: 'upplevelser_nöje',
        label: ' - Upplevelser & nöje',
    },
    {
        value: 'böcker_studentlitteratur',
        label: ' - Böcker & studentlitteratur',
    },
    {
        value: 'cyklar',
        label: ' - Cyklar',
    },
    {
        value: 'djur',
        label: ' - Djur',
    },
    {
        value: 'hobby_samlarprylar',
        label: ' - Hobby & samlarprylar',
    },
    {
        value: 'hästar_ridsport',
        label: ' - Hästar & ridsport',
    },
    {
        value: 'jakt_fiske',
        label: ' - Jakt & fiske',
    },
    {
        value: 'musikutrustning',
        label: ' - Musikutrustning',
    },
    {
        value: 'sport-_fritidsutrustning',
        label: ' - Sport- & fritidsutrustning',
    },
    {
        value: 'affärsverksamhet',
        label: 'Affärsverksamhet',
    },
    {
        value: 'affärsöverlåtelser',
        label: ' - Affärsöverlåtelser',
    },
    {
        value: 'inventarier_maskiner',
        label: ' - Inventarier & maskiner',
    },
    {
        value: 'lokaler_fastigheter',
        label: ' - Lokaler & fastigheter',
    },
    {
        value: 'tjänster',
        label: ' - Tjänster',
    },
    {
        value: 'övrigt',
        label: 'Övrigt',
    },
]

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

export interface SearchFilterDataProps {
    keyword?: string
    regions?: string[] | string
    category?: string
    priceRangeGte?: number
    priceRangeLte?: number
    auction?: boolean
    dateGte?: number
}
export interface SearchPostRequestBody extends SearchOptions {
    searchFilters?: SearchFilterDataProps
}
export interface SearchOptions {
    page?: number
    sort?: SortData
    limit?: number
}

export enum SortData {
    RELEVANCE = 'relevance',
    PRICE_DESC = 'price_desc',
    PRICE_ASC = 'price_asc',
    DATE_ASC = 'date_asc',
    DATE_DESC = 'date_desc',
}

export const sortableFields: Record<SortData, Record<string, number>> = {
    relevance: {},
    price_desc: { 'price.value': -1 },
    price_asc: { 'price.value': 1 },
    date_asc: { date: 1 },
    date_desc: { date: -1 },
}
