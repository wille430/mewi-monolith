import {Scraper} from '../Scraper'
import {KvdBilEndPoint} from './KvdBilEndPoint'
import {Listing} from "@mewi/entities"
import {ListingOrigin} from "@mewi/models"

export class KvdBilScraper extends Scraper<Listing> {

    public static createEndpoints = () => [new KvdBilEndPoint()]

    constructor() {
        super(ListingOrigin.Kvdbil, 'https://www.kvd.se/', KvdBilScraper.createEndpoints())
    }
}
