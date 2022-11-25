import { ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import { Scraper } from '../Scraper'
import { BlippEndPoint } from './BlippEndPoint'

export class BlippScraper extends Scraper<Listing> {
    constructor() {
        super(ListingOrigin.Blipp, 'https://blipp.se/', [new BlippEndPoint()])
    }
}
