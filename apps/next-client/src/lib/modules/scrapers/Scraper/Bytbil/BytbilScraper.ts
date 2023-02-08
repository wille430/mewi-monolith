import { ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import { Scraper } from '../Scraper'
import { BytbilEndPoint } from './BytbilEndPoint'

export class BytbilScraper extends Scraper<Listing> {
    static readonly vehicleTypes = [
        'bil',
        'transportbil',
        'mc',
        'moped',
        'snoskoter',
        'fyrhjuling',
        'husbil',
        'husvagn',
        'slap',
    ]

    constructor() {
        super(
            ListingOrigin.Bytbil,
            'https://bytbil.com/',
            BytbilScraper.vehicleTypes.map((o) => new BytbilEndPoint(o))
        )
    }
}
