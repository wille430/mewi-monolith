import {Scraper} from '../Scraper'
import {BlocketEndPoint} from './BlocketEndPoint'
import {ListingOrigin} from "@mewi/models"
import {Listing} from "@mewi/entities"

export class BlocketScraper extends Scraper<Listing> {

    public static createEndpoints = () => [new BlocketEndPoint()]

    constructor() {
        const baseUrl = 'https://www.blocket.se/'
        super(ListingOrigin.Blocket, baseUrl, BlocketScraper.createEndpoints())
    }
}
