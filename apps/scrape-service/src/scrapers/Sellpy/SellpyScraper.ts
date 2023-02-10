import {Scraper} from '../Scraper'
import {SellpyEndPoint} from './SellpyEndPoint'
import {Listing} from "@mewi/entities"
import {ListingOrigin} from "@mewi/models"

export class SellpyScraper extends Scraper<Listing> {
    constructor() {
        super(ListingOrigin.Sellpy, 'https://www.sellpy.se/', [new SellpyEndPoint()])
    }
}
