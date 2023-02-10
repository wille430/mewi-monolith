import {Scraper} from '../Scraper'
import {ShpockEndPoint} from './ShpockEndPoint'
import {Listing} from "@mewi/entities"
import {ListingOrigin} from "@mewi/models"

export class ShpockScraper extends Scraper<Listing> {
    constructor() {
        super(ListingOrigin.Shpock, 'https://shpock.com/', [new ShpockEndPoint()])
    }
}
