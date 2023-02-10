import {Scraper} from '../Scraper'
import {BlippEndPoint} from './BlippEndPoint'
import {Listing} from "@mewi/entities"
import {ListingOrigin} from "@mewi/models"

export class BlippScraper extends Scraper<Listing> {
    constructor() {
        super(ListingOrigin.Blipp, 'https://blipp.se/', [new BlippEndPoint()])
    }
}
