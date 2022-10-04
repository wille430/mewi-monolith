import { Axios } from 'axios'
import { Store } from '@/store'

export interface BlocketItemData {
    ad_id: string
    ad_status: string
    advertiser: {
        contact_methods: {
            email: string
            phone: true
            sms: true
            name: string
            type: '@/store'
        }
    }
    body: string
    category: {
        id: string
        name:
            | 'Fordon'
            | 'Bilar'
            | 'Båtar'
            | 'Bildelar & biltillbehör'
            | 'Mopeder'
            | 'Båtdelar & tillbehör'
            | 'Husvagnar & husbilar'
            | 'MC-delar'
            | 'A-traktor'
            | 'Lastbil, truck & entreprenad'
            | 'Motorcyklar'
            | 'Snöskotrar'
            | 'Snöskoterdelar'
            | 'För hemmet'
            | 'Bygg & trädgård'
            | 'Husgeråd & vitvaror'
            | 'Möbler & hemindredning'
            | 'Verktyg'
            | 'Bostad'
            | 'Lägenheter'
            | 'Villor'
            | 'Radhus'
            | 'Tomter'
            | 'Gårdar'
            | 'Fritidsboende'
            | 'Utland'
            | 'Personligt'
            | 'Kläder & skor'
            | 'Accessoarer & klockor'
            | 'Barnartiklar & leksaker'
            | 'Barnkläder & skor'
            | 'Elektronik'
            | 'Datorer & TV-spel'
            | 'Ljud & bild'
            | 'Telefoner & tillbehör'
            | 'Fritid & hobby'
            | 'Upplevelser & nöje'
            | 'Böcker & studentlitteratur'
            | 'Cyklar'
            | 'Djur'
            | 'Hobby & samlarprylar'
            | 'Hästar & ridsport'
            | 'Jakt & fiske'
            | 'Musikutrustning'
            | 'Sport- & fritidsutrustning'
            | 'Affärsverksamhet'
            | 'Affärsöverlåtelser'
            | 'Inventarier & maskiner'
            | 'Lokaler & fastigheter'
            | 'Tjänster'
            | 'Övrigt'
    }[]

    images: {
        height: number
        type: 'image'
        url: string
        width: number
    }[]

    infopage: {
        text: string
        url: string
    }
    list_id: string
    list_time: string
    location: {
        id: string
        name: string
        query_key: string
    }[]
    map_url: string
    parameter_groups?: {
        label: string
        parameters: {
            id: string
            label: string
            value: string
        }[]
        type: 'general'
    }[]
    price: {
        label: 'Pris'
        suffix: 'kr'
        value: string
        value_without_vat: number
    }
    safety_tips: {
        id: string
        short_text: string
        subject: string
        text: string
        url: string
    }[]
    share_url: string
    state_id: string
    subject: string
    type: 's'
    zipcode: string
}

export interface SellpyItemData {
    createdAt: number
    updatedAt: number
    user: string
    weight: number
    itemPackaging: string
    metadata: {
        brand: string
        demography: string
        size: string
        type: string
        condition: string
        material: string[]
        color: string[]
    }
    images: string[]
    salesChannel: string
    sizes: string[]
    cat1: string
    cat2: string
    cat3: string
    p2p: boolean
    isReserved: boolean
    featuredIn: string[]
    segment: string
    itemIO: string
    estimateBid_rounded: number
    categories: {
        lvl0: string[]
        lvl1: string[]
        lvl2: string[]
        lvl3: string[]
    }
    pricing: {
        amount: number
        currency: 'SEK'
    }
    isForSale: boolean
    saleStartedAt: number
    price_SE: {
        amount: number
        currency: 'SEK'
    }
    lastChance: boolean
    favouriteCount: number
    favoriteCountBucket: number
    objectID: string
}

export interface TraderaItemData {
    currentBid: number
    itemId: number
    rootItemId: number
    price: number
    isAuction: boolean
    isShopItem: boolean
    shortDescription: string
    imageUrl: string
    imageHeight: number
    imageWidth: number
    itemUrl: string
    itemType: 'auction'
    totalBids: number
    timeLeft: string
    startDate: string
    endDate: string
    categoryId: number
    buyNowPrice: number
    sellerMemberId: number
    showBids: boolean
    showBuyNow: boolean
    discountRate: number
    priceBeforeDiscount: number
    hasDiscount: boolean
    canHaveDiscount: boolean
    sellerAlias: string
    showFreeShippingRibbon: boolean
    showOnDisplayRibbon: boolean
    sellerDsrAverage: number
    prettifyRating: {
        rating: string
        includeTotal: boolean
        noRating: boolean
        isGood: boolean
        isBad: boolean
    }
    isNewToday: boolean
    isEndingSoon: boolean
    isLessThanOneMinuteLeft: boolean
    shippingPrice: string
    isPickupOnly: boolean
    hasNonSpecifiedShipping: boolean
    showShipping: boolean
    hasFreeShipping: boolean
    existsInWishList: boolean
    displayHighlighted: boolean
    onDisplay: boolean
    itemAttributesForFilter: []
    sellerDsrAverageText: string
    searchId: string
    showShopItemSettings: boolean
}

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export interface ValidatorMessage {
    location: string
    msg: string
    param: string
}

export interface FilterStates {
    regionState: { state: string; setState: any }
    categoryState: { state: string; setState: any }
    auctionState: { state: string; setState: any }
    priceRangeState: { state: string; setState: any }
    queryState?: { state: string; setState: any }
}

declare global {
    interface Window {
        Cypress?: any
        store: Store
        axios?: Axios
    }
}

export interface ValidationError {
    target: Record<string, any>
    property: string
    children: Array<any>
    constraints: Record<string, string>
}

export interface ApiErrorResponse {
    statusCode: number
    message: ValidationError[]
    error: string
}
