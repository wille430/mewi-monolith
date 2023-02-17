import {Scraper} from '../Scraper'
import {ShpockEndPoint} from './ShpockEndPoint'
import {Listing} from "@mewi/entities"
import {ListingOrigin} from "@mewi/models"

export class ShpockScraper extends Scraper<Listing> {

    public static createEndpoints = () => [new ShpockEndPoint()]

    constructor() {
        super(ListingOrigin.Shpock, 'https://shpock.com/', ShpockScraper.createEndpoints())
    }
}
