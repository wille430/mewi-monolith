import { CategoryType } from '@wille430/common/types'

interface Props {
    categories: CategoryType
}

const CategoryString = ({ categories }: Props) => {
    const valueToString: any = {
        fordon: 'Fordon',
        bilar: 'Bilar',
        båtar: 'Båtar',
        bildelar_biltillbehör: 'Bildelar & biltillbehör',
        mopeder: 'Mopeder',
        båtdelar_tillbehör: 'Båtdelar & tillbehör',
        husvagnar_husbilar: 'Husvagnar & husbilar',
        'mc-delar': 'MC-delar',
        'a-traktor': 'A-traktor',
        lastbil_truck_entreprenad: 'Lastbil, truck',
        motorcyklar: 'Motorcyklar',
        snöskotrar: 'Snöskotrar',
        snöskoterdelar: 'Snöskoterdelar',
        för_hemmet: 'För hemmet',
        bygg_trädgård: 'Bygg & trädgård',
        husgeråd_vitvaror: 'Husgeråd & vitvaror',
        möbler_hemindredning: 'Möbler & hemindredning',
        verktyg: 'Verktyg',
        bostad: 'Bostad',
        lägenheter: 'Lägenheter',
        villor: 'Villor',
        radhus: 'Radhus',
        tomter: 'Tomter',
        gårdar: 'Gårdar',
        fritidsboende: 'Fritidsboende',
        utland: 'Utland',
        personligt: 'Personligt',
        kläder_skor: 'Kläder & skor',
        accessoarer_klockor: 'Accessoarer & klockor',
        barnartiklar_leksaker: 'Barnartiklar & leksaker',
        barnkläder_skor: 'Barnkläder & skor',
        elektronik: 'Elektronik',
        'datorer_tv-spel': 'Datorer & TV-spel',
        ljud_bild: 'Ljud & bild',
        telefoner_tillbehör: 'Telefoner & tillbehör',
        fritid_hobby: 'Fritid & hobby',
        upplevelser_nöje: 'Upplevelser & nöje',
        böcker_studentlitteratur: 'Böcker & studentlitteratur',
        cyklar: 'Cyklar',
        djur: 'Djur',
        hobby_samlarprylar: 'Hobby & samlarprylar',
        hästar_ridsport: 'Hästar & ridsport',
        jakt_fiske: 'Jakt & fiske',
        musikutrustning: 'Musikutrustning',
        'sport-_fritidsutrustning': 'Sport- & fritidsutrustning',
        affärsverksamhet: 'Affärsverksamhet',
        affärsöverlåtelser: 'Affärsöverlåtelser',
        inventarier_maskiner: 'Inventarier & maskiner',
        lokaler_fastigheter: 'Lokaler & fastigheter',
        tjänster: 'Tjänster',
        övrigt: 'Övrigt',
    }

    categories = categories ? categories.map((cat) => valueToString[cat] || '') : ['Okategoriserad']

    return <span className='py-1 text-sm font-light'>{categories.join(' > ')}</span>
}

export default CategoryString
