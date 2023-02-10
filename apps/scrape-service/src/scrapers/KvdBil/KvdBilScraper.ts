import {Scraper} from '../Scraper'
import {KvdBilEndPoint} from './KvdBilEndPoint'
import {Listing} from "@mewi/entities"
import {ListingOrigin} from "@mewi/models"

export class KvdBilScraper extends Scraper<Listing> {
    constructor() {
        super(ListingOrigin.Kvdbil, 'https://www.kvd.se/', [new KvdBilEndPoint()])
    }
}
