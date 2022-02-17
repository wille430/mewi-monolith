import { TraderaItemData } from 'types/types'
import { ItemData } from '@mewi/types'
import { toUnixTime } from '@mewi/util'
import CategoryService from '../CategoryService'
import Scraper from 'services/scrapers/Scraper'
import axios from 'axios'

interface TraderaCategory {
    id: number
    title: string
    href?: string
    categoryNodes: {
        title: string
        href?: string
        isTopLevel: boolean
        isSpaRoute: boolean
    }[]
}

export default class TraderaScraper extends Scraper {
    catIndex = 0
    baseUrl = 'https://www.tradera.com'
    categories: TraderaCategory[] | null
    itemsPerCategory: number

    constructor(maxEntries?) {
        super({
            maxEntries,
            name: 'tradera',
            limit: 1,
        })
    }

    async getNextArticles(): Promise<ItemData[]> {
        if (!this.categories) this.categories = await this.getCategories()
        if (!this.categories[this.catIndex].href) return []

        if (!this.itemsPerCategory)
            this.itemsPerCategory = Math.round(this.maxEntries / this.categories.length)

        const url =
            'https://www.tradera.com' +
            this.categories[this.catIndex].href +
            '.json' +
            '?paging=MjpBdWN0aW9ufDM5fDE4Nzg0OlNob3BJdGVtfDl8NDMzNTg.&spage=1'

        try {
            let itemData: TraderaItemData[] = await axios.get(url).then((res) => res.data.items)

            itemData = itemData.slice(0, this.itemsPerCategory)

            const items: ItemData[] = itemData.map(
                (item): ItemData => ({
                    id: item.itemId.toString(),
                    title: item.shortDescription,
                    category: CategoryService.parseTraderaCategories(
                        this.categories[this.catIndex].title
                    ), // WIP
                    date: item.startDate ? toUnixTime(new Date(item.startDate)) : Date.now(),
                    endDate: toUnixTime(new Date(item.endDate)),
                    imageUrl: [item.imageUrl],
                    isAuction: !!item.endDate || item.itemType === 'auction',
                    redirectUrl: this.baseUrl + item.itemUrl,
                    price: item.price
                        ? {
                              value: item.price,
                              currency: 'kr',
                          }
                        : undefined,
                    region: null,
                    origin: 'Tradera',
                })
            )

            this.catIndex += 1
            return items
        } catch (e) {
            console.log(e.stack)
        }
    }

    async getCategories() {
        const url = 'https://www.tradera.com/categories'
        const categoriesData: TraderaCategory[] = await axios.get(url).then((res) => res.data)

        return categoriesData
    }

    translateCategory(traderaCat: string): string[] {
        const cats = {
            Accessoarer: ['personligt', 'accessoarer_klockor'],
            'Antikt & Design': ['för_hemmet', 'möbler_hemindredning'],
            'Barnkläder & Barnskor': ['personligt', 'barnkläder_skor'],
            'Biljetter & Resor': ['fritid_hobby', 'upplevelser_nöje'],
            'Bygg & Verktyg': ['för_hemmet', 'bygg_trädgård', 'Verktyg'],
            'Böcker & Tidningar': ['fritid_hobby', 'böcker_studentlitteratur'],
            'Datorer & Tillbehör': ['elektronik', 'datorer_tv-spel'],
            'DVD & Videofilmer': ['elektronik', 'ljud_bild'],
            'Fordon: , Båtar & Delar': ['fordon', 'båtar', 'båtdelar_tillbehör'],
            'Foto: , Kameror & Optik': ['elektronik', 'ljud_bild'],
            Frimärken: ['fritid_hobby', 'hobby_samlarprylar'],
            'Handgjort & Konsthantverk': ['för_hemmet'],
            'Hem & Hushåll': ['för_hemmet', 'möbler_hemindredning'],
            Hemelektronik: ['elektronik'],
            Hobby: ['fritid_hobby'],
            Klockor: ['personligt', 'accessoarer_klockor'],
            Kläder: ['personligt', 'kläder_skor'],
            Konst: ['för_hemmet', 'möbler_hemindredning'],
            'Leksaker & Barnartiklar': ['personligt', 'barnartiklar_leksaker'],
            'Mobiltelefoni & Tele': ['elektronik', 'telefoner_tillbehör'],
            Musik: ['elektronik', 'ljud_bild'],
            'Mynt & Sedlar': ['fritid_hobby', 'hobby_samlarprylar'],
            Samlarsaker: ['fritid_hobby', 'hobby_samlarprylar'],
            Skor: ['personligt', 'kläder_skor'],
            Skönhetsvård: ['personligt'],
            'Smycken & Ädelstenar': ['personligt', 'accessoarer_klockor'],
            'Sport & Fritid': ['fritid_hobby', 'sport-_fritidsutrustning'],
            'Trädgård & Växter': ['för_hemmet', 'bygg_trädgård'],
            'TV-spel & Datorspel': ['elektronik', 'datorer_tv-spel'],
            'Vykort & Bilder': ['fritid_hobby'],
            Övrigt: ['övrigt'],

            // "Allt inom Accessoarer": ["Personligt", "Accessoarer & klockor"],
            // "Bröllopsaccessoarer": ["Personligt", "Accessoarer & klockor"],
            // "Bälten & Skärp": ["Personligt", "Accessoarer & klockor"],
            // "Glasögon": ["Personligt", "Accessoarer & klockor"],
            // "Halsdukar": ["Personligt", "Accessoarer & klockor"],
            // "Handskar & Vantar": ["Personligt", "Accessoarer & klockor"],
            // "Håraccessoarer": ["Personligt", "Accessoarer & klockor"],
            // "Mössor": ["Personligt", "Accessoarer & klockor"],
            // "Kepsar & Hattar": ["Personligt", "Accessoarer & klockor"],
            // "Plånböcker": ["Personligt", "Accessoarer & klockor"],
            // "Sjalar & Scarfs": ["Personligt", "Accessoarer & klockor"],
            // "Solglasögon": ["Personligt", "Accessoarer & klockor"],
            // "Tygmärken & Pins": ["Personligt", "Accessoarer & klockor"],
            // "Väskor": ["Personligt", "Accessoarer & klockor"],
            // // "Övrigt": null,
            // "Accessoarer": ["Personligt", "Accessoarer & klockor"],

            // "Allt inom Antikt & Design": ["För hemmet", "Möbler & heminredning"],
            // "Allmoge": ["För hemmet", "Möbler & heminredning"],
            // "Antiken": ["För hemmet", "Möbler & heminredning"],
            // "Romarriket mm": ["För hemmet", "Möbler & heminredning"],
            // "Antikviteter": ["För hemmet", "Möbler & heminredning"],
            // "Beslag & Reservdelar": ["För hemmet", "Möbler & heminredning"],
            // "Bruks- & Prydnadsföremål": ["För hemmet", "Möbler & heminredning"],
            // "Forntid": ["För hemmet", "Möbler & heminredning"],
            // "Fossil": ["För hemmet", "Möbler & heminredning"],
            // "Glas": ["För hemmet", "Möbler & heminredning"],
            // "Hemslöjd": ["För hemmet", "Möbler & heminredning"],
            // "Ikoner": ["För hemmet", "Möbler & heminredning"],
            // "Julsaker": ["För hemmet", "Möbler & heminredning"],
            // "Keramik & Porslin": ["För hemmet", "Möbler & heminredning"],
            // "Svenskt": ["För hemmet", "Möbler & heminredning"],
            // "Utländskt": ["För hemmet", "Möbler & heminredning"],
            // "Konsthantverk": ["För hemmet", "Möbler & heminredning"],
            // "Koppar": ["För hemmet", "Möbler & heminredning"],
            // "Kuriosa": ["För hemmet", "Möbler & heminredning"],
            // "Mattor": ["För hemmet", "Möbler & heminredning"],
            // "Orientalisk konst & porslin": ["För hemmet", "Möbler & heminredning"],
            // "Plast": ["För hemmet", "Möbler & heminredning"],
            // "Påsksaker": ["För hemmet", "Möbler & heminredning"],
            // "Ramar": ["För hemmet", "Möbler & heminredning"],
            // "Silver": ["För hemmet", "Möbler & heminredning"],
            // "Skulpturer": ["För hemmet", "Möbler & heminredning"],
            // "Tenn & Mässing": ["För hemmet", "Möbler & heminredning"],
            // "Textilier": ["För hemmet", "Möbler & heminredning"],
            // "Övrig konst & design": ["För hemmet", "Möbler & heminredning"],
            // "Antikt & Design": ["För hemmet", "Möbler & heminredning"],

            // "Allt inom Barnkläder & Barnskor": ["Personligt", "Barnkläder & skor"],
            // "Barnskor": ["Personligt", "Barnkläder & skor"],
            // "Maskeradkläder": ["Personligt", "Barnkläder & skor"],
            // "Strl < 50 (nyfödd)": ["Personligt", "Barnkläder & skor"],
            // "Strl 110/116 (4-6 år)": ["Personligt", "Barnkläder & skor"],
            // "Strl 122/128": ["Personligt", "Barnkläder & skor"],
            // "Strl 134/140": ["Personligt", "Barnkläder & skor"],
            // "Strl 146/152": ["Personligt", "Barnkläder & skor"],
            // "Strl 158/164": ["Personligt", "Barnkläder & skor"],
            // "Strl 170 och större": ["Personligt", "Barnkläder & skor"],
            // "Strl 50/56 (0-2 mån)": ["Personligt", "Barnkläder & skor"],
            // "Strl 62/68 (2-6 mån)": ["Personligt", "Barnkläder & skor"],
            // "Strl 74/80 (6-12 mån)": ["Personligt", "Barnkläder & skor"],
            // "Strl 86/92 (1-2 år)": ["Personligt", "Barnkläder & skor"],
            // "Strl 98/104 (2-4 år)": ["Personligt", "Barnkläder & skor"],
            // "Strumpor & Sockor": ["Personligt", "Barnkläder & skor"],
            // "Övriga badkläder & UV-dräkter": ["Personligt", "Barnkläder & skor"],
            // "Övriga barnkläder": ["Personligt", "Barnkläder & skor"],
            // "Barnkläder & Barnskor": ["Personligt", "Barnkläder & skor"],

            // "Allt inom Biljetter & Resor": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Bio & Teater": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Bussbiljetter": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Båt & Kryssning": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Charter": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Flygbiljetter": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Hotell & Övernattningar": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Hyrbilar": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Konserter": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Sportevenemang": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Startplatser": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Tågbiljetter": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Upplevelser": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Övriga presentkort": ["Fritid & hobby", "Upplevelser & nöje"],
            // "Biljetter & Resor": ["Fritid & hobby", "Upplevelser & nöje"],

            // "Allt inom Bygg & Verktyg": ["För hemmet", "Bygg & trädgård", "Verktyg"],
            // "Badrum": ["För hemmet", "Möbler & heminredning"],
            // "Belysning & Armaturer": ["För hemmet", "Möbler & heminredning"],
            // "Byggmaterial": ["För hemmet", "Bygg & trädgård"],
            // "Elinstallation": ["För hemmet", "Bygg & trädgård"],
            // "Färg & Tapeter": ["För hemmet", "Bygg & trädgård"],
            // "Golv": ["För hemmet", "Bygg & trädgård"],
            // "Kakel & Klinker": ["För hemmet", "Bygg & trädgård"],
            // "Krokar": ["För hemmet", "Bygg & trädgård"],
            // "Handtag & Beslag": ["För hemmet", "Bygg & trädgård"],
            // "Kök": ["För hemmet", "Husgeråd & vitvaror"],
            // "Lås & Larm": ["För hemmet", "Bygg & trädgård"],
            // "Maskiner": ["För hemmet", "Bygg & trädgård", "Verktyg"],
            // "Skruv": ["För hemmet", "Bygg & trädgård", "Verktyg"],
            // "Plugg & Spik": ["För hemmet", "Bygg & trädgård", "Verktyg"],
            // "Skyddsutrustning & Kläder": ["För hemmet", "Bygg & trädgård", "Verktyg"],
            // "Solenergi": ["För hemmet", "Bygg & trädgård", "Verktyg"],
            // "Svetsning & Lödning": ["För hemmet", "Bygg & trädgård", "Verktyg"],
            // "Verkstad": ["För hemmet", "Bygg & trädgård", "Verktyg"],
            // "Verktyg": ["För hemmet", "Bygg & trädgård", "Verktyg"],
            // "VVS": ["För hemmet", "Bygg & trädgård", "Verktyg"],
            // "Värme": ["För hemmet", "Bygg & trädgård", "Verktyg"],
            // "Bygg & Verktyg": ["För hemmet", "Bygg & trädgård", "Verktyg"],

            // "Allt inom Böcker & Tidningar": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Almanackor & Kalendrar": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Antika Böcker": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Antologier": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Barn- & Ungdomsböcker": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Biografier & Memoarer": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Botanik": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Dator & Teknik": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Drama": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Dans": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Film & Teater": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Filosofi": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Religion & Livsåskådning": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Flyg- & Flyghistoria": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Fordonslitteratur": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Fotolitteratur": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Företagsrelaterat": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Grafik": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Kartor & Tryck": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Graviditets- & Barnböcker": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Handarbete": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Handskrifter & Manuskript": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Harlequin / Kiosklitteratur": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Hem & Hushåll": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Historia": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Husdjur": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Hälsa & Skönhet": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Juridik & Kriminologi": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Järnväg & Spårväg": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Konst & Hantverk": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Korsord & korsordsrelaterat": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Kurslitteratur & Undervisning": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Litteraturvetenskap": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Ljudböcker & Språkkurser": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Medicin & Psykologi": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Musik": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Visor & Vistryck": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Naturalia": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Naturvetenskap": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Planschv. & Illustr. böcker": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Pocket": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Resor & Topografi": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Samhällskunskap": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Serier Sverige": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Serier USA": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Serier övriga världen": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Serier/Tidskrifter övrigt": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Skönlitteratur": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Sport & Fritid": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Technica & Nautica": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Tidskrifter": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Uppslagsverk & Lexikon": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Övriga böcker": ["Fritid & hobby", "Böcker & studentlitteratur"],
            // "Böcker & Tidningar": ["Fritid & hobby", "Böcker & studentlitteratur"],
        }

        return cats[traderaCat]
    }
}
