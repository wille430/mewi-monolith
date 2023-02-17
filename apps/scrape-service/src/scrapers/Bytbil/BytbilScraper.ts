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

    public static createEndpoints = () => BytbilScraper.vehicleTypes.map((o) => new BytbilEndPoint(o))

    constructor() {
        super(
            ListingOrigin.Bytbil,
            'https://bytbil.com/',
            BytbilScraper.createEndpoints()
        )
    }
}
