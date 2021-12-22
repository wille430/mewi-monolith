export interface SearchState {
    searchId: string
    totalHits: number
    hits: Object[]
}

export interface ItemData {
    id: string
    title: string
    body: string
    category: string[]
    date: number
    imageUrl: string[]
    redirectUrl: string
    price: {
        value: number
        currency: string
    }
    region: string
    zipcode: string
    parameters: {
        id: string
        label: string
        value: string
    }[]
    origin: 'Blocket' | 'Tradera' | 'Sellpy'
    [key: string]: any
}

export interface CategoryData {
    _id: string
    cat: string
    subcat: CategoryData[]
}
