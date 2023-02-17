import {Scraper} from '../Scraper'
import {Listing} from "@mewi/entities"
import {ListingOrigin} from "@mewi/models"
import {BilwebEndPoint} from "./BilwebEndPoint"

export class BilwebScraper extends Scraper<Listing> {

    public static createEndpoints = () => [new BilwebEndPoint()]

    constructor() {
        super(ListingOrigin.Bilweb, 'https://bilweb.se/', BilwebScraper.createEndpoints())
    }
}
