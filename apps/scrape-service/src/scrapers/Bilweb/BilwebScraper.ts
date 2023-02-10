import {Scraper} from '../Scraper'
import {BilwebEndPoint} from './BilwebEndPoint'
import {Listing} from "@mewi/entities"
import {ListingOrigin} from "@mewi/models"

export class BilwebScraper extends Scraper<Listing> {
    constructor() {
        super(ListingOrigin.Bilweb, 'https://bilweb.se/', [new BilwebEndPoint()])
    }
}
