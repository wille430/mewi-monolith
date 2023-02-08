import { ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import { Scraper } from '../Scraper'
import { TraderaCategories } from './TraderaCategories'
import { TraderaEndPoint } from './TraderaEndPoint'

export class TraderaScraper extends Scraper<Listing> {
    constructor() {
        const endPoints = TraderaCategories.map(({ href }) => href).map(
            (href) => new TraderaEndPoint(href)
        )
        super(ListingOrigin.Tradera, 'https://www.tradera.com/', endPoints)
    }
}
