import { ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import { Scraper } from '../Scraper'
import { BlocketEndPoint } from './BlocketEndPoint'

export class BlocketScraper extends Scraper<Listing> {
    constructor() {
        const baseUrl = 'https://www.blocket.se/'
        super(ListingOrigin.Blocket, baseUrl, [new BlocketEndPoint()])
    }
}