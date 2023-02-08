import { ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import { Scraper } from '../Scraper'
import { KvdBilEndPoint } from './KvdBilEndPoint'

export class KvdBilScraper extends Scraper<Listing> {
    constructor() {
        super(ListingOrigin.Kvdbil, 'https://www.kvd.se/', [new KvdBilEndPoint()])
    }
}
