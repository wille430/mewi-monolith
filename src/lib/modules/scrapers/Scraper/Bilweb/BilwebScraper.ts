import { ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import { Scraper } from '../Scraper'
import { BilwebEndPoint } from './BilwebEndPoint'

export class BilwebScraper extends Scraper<Listing> {
    constructor() {
        super(ListingOrigin.Bilweb, 'https://bilweb.se/', [new BilwebEndPoint()])
    }
}
