import { ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import { Scraper } from '../Scraper'
import { CitiboardEndPoint } from './CitiboardEndPoint'

export class CitiboardScraper extends Scraper<Listing> {
    constructor() {
        super(ListingOrigin.Citiboard, 'https://citiboard.se/', [new CitiboardEndPoint()])
    }
}
