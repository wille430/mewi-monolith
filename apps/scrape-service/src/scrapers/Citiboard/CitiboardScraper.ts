import {Scraper} from '../Scraper'
import {CitiboardEndPoint} from './CitiboardEndPoint'
import {Listing} from "@mewi/entities"
import {ListingOrigin} from "@mewi/models"

export class CitiboardScraper extends Scraper<Listing> {

    public static createEndpoints = () => [new CitiboardEndPoint()]

    constructor() {
        super(ListingOrigin.Citiboard, 'https://citiboard.se/', CitiboardScraper.createEndpoints())
    }
}
