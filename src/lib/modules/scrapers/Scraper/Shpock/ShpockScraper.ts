import { ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import { Scraper } from '../Scraper'
import { ShpockEndPoint } from './ShpockEndPoint'

export class ShpockScraper extends Scraper<Listing> {
    constructor() {
        super(ListingOrigin.Shpock, 'https://shpock.com/', [new ShpockEndPoint()])
    }
}
