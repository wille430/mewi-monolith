import { ObjectId } from 'bson'
import { JWT, SearchFilterDataProps } from '..'

/**
 * Models
 */

export interface UserWatcherData {
    _id: string,
    notifiedAt?: string,
    createdAt: string,
    updatedAt: string
}

export interface UserData {
    email: string,
    password: string,
    premium: boolean,
    watchers: [UserWatcherData]
}

export interface WatcherMetadata extends SearchFilterDataProps {
    keyword: string
}

export interface PublicWatcher {
    _id: ObjectId,
    query: any,
    metadata: {
        keyword: string,
        category?: string,
        regions?: string[],
        isAuction?: boolean,
        priceRange?: {
            gte: string,
            lte: string
        }
    },
    users: ObjectId[],
    createdAt: string
}

export interface FilterStates {
    regionState: { state: string, setState: any },
    categoryState: { state: string, setState: any },
    auctionState: { state: string, setState: any },
    priceRangeState: { state: string, setState: any },
    queryState?: { state: string, setState: any }
}

export interface PriceRangeProps {
    lte: string,
    gte: string
}

// ELASTICSEARCH

export interface ElasticQuery {
    bool: {
        must: ({ span_or: { clauses: any[] } } | { match: { [key: string]: any } })[],
        filter?: { [key: string]: any }[],
        must_not?: any[]
    }
}

export interface ElasticSearchBody {
    query: ElasticQuery,
    size: number,
    sort?: { [key: string]: any }[],
    from: number
}


export type Category = ("fordon" | "för_hemmet" | "bostad" | "personligt" | "elektronik" | "fritid_hobby" | "affärsverksamhet" | "övrigt" | "bilar" | "båtar" | "bildelar_biltillbehör" | "mopeder" | "båtdelar_tillbehör" | "husvagnar_husbilar" | "mc-delar" | "a-traktor" | "lastbil_truck_entreprenad" | "motorcyklar" | "snöskotrar" | "snöskoterdelar" | "bygg_trädgård" | "husgeråd_vitvaror" | "möbler_hemindredning" | "verktyg" | "lägenheter" | "villor" | "radhus" | "tomter" | "gårdar" | "fritidsboende" | "utland" | "kläder_skor" | "accessoarer_klockor" | "barnartiklar_leksaker" | "barnkläder_skor" | "datorer_tv-spel" | "ljud_bild" | "telefoner_tillbehör" | "upplevelser_nöje" | "böcker_studentlitteratur" | "cyklar" | "djur" | "hobby_samlarprylar" | "hästar_ridsport" | "jakt_fiske" | "musikutrustning" | "sport-_fritidsutrustning" | "affärsöverlåtelser" | "inventarier_maskiner" | "lokaler_fastigheter" | "tjänster" | "övrigt")[]

export interface ItemData {
    id: string,
    title: string,
    body?: string,
    category: Category,
    date?: number,
    endDate?: number,
    imageUrl: string[],
    isAuction: boolean,
    redirectUrl: string,
    price: {
        value: number,
        currency: string
    } | {},
    region: string,
    zipcode?: string,
    parameters?: {
        id: string,
        label: string,
        value: string
    }[],
    origin: string
}

export interface AuthTokens {
    jwt?: JWT,
    refreshToken?: string
}