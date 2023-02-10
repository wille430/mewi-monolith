import {Scraper} from '../Scraper'
import {BytbilEndPoint} from './BytbilEndPoint'
import {Listing} from "@mewi/entities"
import {ListingOrigin} from "@mewi/models"

export class BytbilScraper extends Scraper<Listing> {
    public static readonly vehicleTypes = [
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
