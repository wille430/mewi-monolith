import {Scraper} from '../Scraper'
import {Listing} from "@mewi/entities"
import {ListingOrigin} from "@mewi/models"
import {BlippEndPoint} from "./BlippEndPoint"

export class BlippScraper extends Scraper<Listing> {
    public static createEndpoints = () => [new BlippEndPoint()]

    constructor() {
        super(ListingOrigin.Blipp, 'https://blipp.se/', BlippScraper.createEndpoints())
    }
}
