import { ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import { Scraper } from '../Scraper'
import { SellpyEndPoint } from './SellpyEndPoint'

export class SellpyScraper extends Scraper<Listing> {
    constructor() {
        super(ListingOrigin.Sellpy, 'https://www.sellpy.se/', [new SellpyEndPoint()])
    }
}
